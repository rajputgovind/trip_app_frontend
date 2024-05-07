import Header from "@/components/HeaderSection/Header";
import React, { useState, useEffect, useContext } from "react";
import { Md1K, MdKeyboardArrowLeft } from "react-icons/md";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import add from "../../../public/addimg.svg";
import Image from "next/image";
import { toast } from "react-toastify";
import Select from "react-select";
import { useRouter } from "next/router";
import { MyContext } from "../../../MyContext";
import {
  addDestinationForm,
  getProfileInfo,
} from "../../../ApiServices/apiService";
import cookie from "js-cookie";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Dropdown from "react-bootstrap/Dropdown";
import { Countries } from "@/countries";
import dynamic from "next/dynamic";
import { Currencies } from "@/currencies";
import Editor from "../../../components/Editor";

const validationSchema = yup.object().shape({
  date: yup
    .date()
    .typeError("ارجوك ادخل تاريخ صحيح")
    .min(new Date(), "يجب أن يكون التاريخ في المستقبل")
    .required("التاريخ مطلوب"),
  price: yup
    .number()
    .typeError("يجب أن يكون السعر إيجابيا")
    .required("السعر مطلوب")
    .positive("يجب أن يكون السعر رقمًا موجبًا"),
  duration: yup
    .number()
    .typeError("يجب أن يكون السعر إيجابيا")
    .required("السعر مطلوب")
    .positive("يجب أن يكون السعر"),
  email: yup
    .string()
    .email("يرجى إدخال البريد الإلكتروني الصحيح")
    .required("البريد الالكتروني مطلوب"),
  name: yup.string().required("مطلوب اسم"),
  phone: yup.string().label("رقم الهاتف المحمول").required("رقم الهاتف مطلوب"),
  tripName: yup.string().required("اسم الرحلة مطلوب"),
  image: yup.mixed().test("fileType", "الصور مسموحة فقط", (value) => {
    if (!value) return true;
    return ["image/jpeg", "image/png", "image/jpg"].includes(value[0]?.type);
  }),
  tripLogo: yup.mixed().test("fileType", "الصور مسموحة فقط", (value) => {
    if (!value) return true;
    return ["image/jpeg", "image/png", "image/jpg"].includes(value[0]?.type);
  }),

  destinations: yup.array().of(
    yup.object().shape({
      city: yup.string().required("المدينة مطلوبة"),
      hotelName: yup.string().required("يجب أن يكون اسم الفندق مطلوبًا"),
      duration: yup.string().required("المدة مطلوبة"),
      faceImage: yup.mixed().test("fileType", "الصور مسموحة فقط", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(
          value[0]?.type
        );
      }),
    })
  ),
});

const MultiSelectcustomStyles = {
  input: (provided, state) => ({
    ...provided,
    color: "#000",
    width: "150px",
  }),
  option: (provided, state) => ({
    ...provided,

    backgroundColor: state.isSelected ? "#fff" : "#fff",
    "&:hover": {
      backgroundColor: "#059db0",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    color: "#000",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "#000",
  }),
};
const Index = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    flightInformation,
    setFlightInformation,
    addDestination,
    setDestination,
  } = useContext(MyContext);

  const router = useRouter();
  const handleAddDestination = () => {
    if (
      addDestination[addDestination.length - 1]?.date &&
      addDestination[addDestination.length - 1]?.duration
    ) {
      setDestination([
        ...addDestination,
        {
          duration: "",
          date: "",
          city: "",
          agenda: "",
          faceImage: "",
          hotelName: "",
        },
      ]);
    } else {
      toast.error("الرجاء اضافة الرقم السابق من الليالي");
    }
  };
  const [selectedTripType, setSelectedTripType] = useState("");
  const [selectedGroupType, setSelectedGroupType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [stateDataChange, setStateChange] = useState(true);
  const handleInputChange = (e, index) => {
    if (e.target.name.split(".")[1] !== "faceImage") {
      const name = e.target.name.split(".")[1];
      const { value } = e.target;
      const list = [...addDestination];

      list[index][name] = value;
      setDestination(list);
    } else {
      const fileList = e.target.files;
      const filesArray = Array.from(fileList);
      const name = e.target.name.split(".")[1];
      const list = [...addDestination];
      list[index][name] = filesArray;
      setDestination(list);
    }
  };

  const addTrip = () => {
    if (
      flightInformation?.tripIncludes &&
      flightInformation?.groupType &&
      flightInformation?.tripType &&
      flightInformation?.country &&
      flightInformation?.currency &&
      flightInformation?.termsAndConditions &&
      !addDestination.some((destination) => !destination.agenda)
    ) {
      router.push("/admin/user-form-page");
    } else {
      toast.error("يرجى ملء النموذج الكامل");
    }
  };
  useEffect(() => {
    let token = cookie.get("token");
    if (token) {
      let role = cookie.get("role");
      if (role === "Organizer") {
        router.push("/admin/trip-info");
      } else {
        router.push("/");
      }
    } else {
      router.push("/admin/login?User=false");
    }
  }, []);
  useEffect(() => {
    let countryData = Countries?.map((country) => {
      return {
        label: country.nameAr,
        value: country?.name,
      };
    });
    setOptions(countryData);
  }, []);

  useEffect(() => {
    let token = cookie.get("token");
    setCurrencyOptions([
      { label: "‌ريال سعودي ", value: "‌ريال سعودي " },
      { label: "‌دينار كويتي ", value: "‌دينار كويتي " },
      { label: "‌دينار بحريني ", value: "‌دينار بحريني " },
      { label: "‌دولار امريكي ", value: "‌دولار امريكي " },
      { label: "يورو", value: "يورو" },
    ]);
    if (token) {
      getProfileInfo(token, setFlightInformation, setLoading, router, setValue);
    } else {
      router.push("/admin/login?User=false");
    }
  }, []);

  useEffect(() => {
    if (flightInformation?.date) {
      const newDate = new Date(flightInformation?.date);
      if (flightInformation?.duration) {
        newDate.setDate(newDate.getDate());

        const dataDate = new Date(newDate).toISOString().split("T")[0];

        setValue("destinations[0].date", dataDate);
        addDestination[0].date = dataDate;
        setStateChange(!stateDataChange);
      } else {
        newDate.setDate(newDate.getDate() + Number(0));
        setFlightInformation({ ...flightInformation, duration: 0 });
        setValue("duration", 0);
        const dataDate = new Date(newDate).toISOString().split("T")[0];

        setValue("destinations[0].date", dataDate);
        addDestination[0].date = dataDate;
        setStateChange(!stateDataChange);
      }
    }
  }, [flightInformation?.duration, flightInformation?.date]);

  useEffect(() => {
    for (let i = 0; i < addDestination.length - 1; i++) {
      if (addDestination[i].date && addDestination[i].duration) {
        const newDate = new Date(addDestination[i].date);
        newDate.setDate(newDate.getDate() + Number(addDestination[i].duration));
        const dataDate = new Date(newDate).toISOString().split("T")[0];

        addDestination[i + 1].date = dataDate;
        setValue(`destinations[${i + 1}.date`, dataDate);
      }
    }
  }, [addDestination, stateDataChange]);
  const [editorLoaded, setEditorLoaded] = useState(false);

  const stateMangeFunction = () => {
    setDestination([
      {
        duration: "",
        date: "",
        city: "",
        agenda: "",
        hotelName: "",
        image: 0,
        faceImage: [],
      },
    ]);
    reset();
    setFlightInformation({
      country: "",
      date: "",
      duration: "",
      tripIncludes: "",
      price: "",
      email: "",
      name: "",
      phone: "",
      tripName: "",
      groupType: "",
      tripType: "",
      image: "",
      tripLogo: "",
      termsAndConditions: "",
      currency: "",
      logoTripDummy: null,
      mainTripDummy: null,
    });
  };
  useEffect(() => {
    setEditorLoaded(true);
  }, []);
  useEffect(() => {
    stateMangeFunction();
  }, []);
  return (
    <>
      <Header />

      <div className="trip-info-bg-section">
        {loading === true ? (
          <div className="loader-box">
            <div className="loader"></div>
          </div>
        ) : (
          ""
        )}
        <div className="container">
          <div className="breadcrumbs-txt-container pt-5">
            <p
              className="cursor-pointer"
              onClick={() => {
                router.push("/admin/my-trip");
              }}
            >
              إنشاء رحلات
            </p>
            <MdKeyboardArrowLeft />
            <p
              className="breadcrumbs-active cursor-pointer"
              onClick={() => {
                router.push("/admin/trip-info");
              }}
            >
              ادخال معلومات الرحلة
            </p>
          </div>
          <div className="info-checkbox">
            <div className="infocheck">
              <div className="active-infocheck"></div>
              <p>معلومات الرحلة</p>
            </div>

            <div className="infocheck">
              <div className="inactive-infocheck"></div>
              <p>معلومات المسافر</p>
            </div>
          </div>

          <div className="trip-info-form mb-5">
            <p className="">معلومات الرحلة</p>
            <Form>
              <Row>
                <Col xs={12} md={4}>
                  <Form.Label>الدولة</Form.Label>
                  <div className="search-select-trip">
                    <Select
                      isClearable
                      name="country"
                      placeholder="الدولة"
                      styles={MultiSelectcustomStyles}
                      options={options}
                      onChange={(e) => {
                        if (e) {
                          setFlightInformation({
                            ...flightInformation,
                            country: e?.value,
                          });
                          setSelectedCountry(e?.label);
                        } else {
                          setFlightInformation({
                            ...flightInformation,
                            country: "",
                          });
                          setSelectedCountry("");
                        }
                      }}
                    />
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>التاريخ</Form.Label>

                  <Form.Control
                    name="date"
                    placeholder="التاريخ"
                    type="date"
                    {...register("date", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.value,
                        });
                      },
                    })}
                  />
                  {errors && errors?.date && (
                    <span className="error-msg">{errors?.date?.message}</span>
                  )}
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>ليالي‌‌/ ‌‌ليلة</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    placeholder="ليالي‌‌/ ‌‌ليلة"
                    {...register("duration", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.value,
                        });
                      },
                    })}
                  />
                  {errors && errors?.duration && (
                    <span className="error-msg">
                      {errors?.duration?.message}
                    </span>
                  )}
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={4}>
                  <Form.Label>السعر الاجمالي</Form.Label>
                  <Form.Control
                    name="price"
                    type="number"
                    placeholder="السعر الاجمالي"
                    {...register("price", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.value,
                        });
                      },
                    })}
                  />
                  {errors && errors?.price && (
                    <span className="error-msg">{errors?.price?.message}</span>
                  )}
                </Col>

                <Col xs={12} md={4}>
                  <Form.Label>صورة رئيسية للرحلة</Form.Label>

                  <Form.Control
                    type="file"
                    name="image"
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                    {...register("image", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.files[0],
                        });
                      },
                    })}
                  />
                  {errors && errors?.image && (
                    <span className="error-msg">{errors?.image?.message}</span>
                  )}
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>ما تشمله الرحلة</Form.Label>
                  <Editor
                    name="tripIncludes"
                    onChange={(data) => {
                      setFlightInformation({
                        ...flightInformation,
                        tripIncludes: data,
                      });
                      // setData(data);
                    }}
                    editorLoaded={editorLoaded}
                    style={{ height: "134px" }}
                  />

                  {errors && errors?.tripIncludes && (
                    <span className="error-msg">
                      {errors?.tripIncludes?.message}
                    </span>
                  )}
                </Col>
              </Row>
              <Row>
                <Form.Label>عملة </Form.Label>
                <Col xs={12} md={4}>
                  <div className="search-select">
                    <Select
                      isClearable
                      name="currency"
                      placeholder="عملة"
                      styles={MultiSelectcustomStyles}
                      options={currencyOptions}
                      onChange={(e) => {
                        if (e) {
                          setFlightInformation({
                            ...flightInformation,
                            currency: e.value,
                          });
                        } else {
                          setFlightInformation({
                            ...flightInformation,
                            currency: "",
                          });
                        }
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4}>
                  <Form.Label>اسم رحلة</Form.Label>
                  <Form.Control
                    type="text"
                    name="tripName"
                    placeholder="اسم رحلة"
                    {...register("tripName", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.value,
                        });
                      },
                    })}
                  />
                  {errors && errors?.tripName && (
                    <span className="error-msg">
                      {errors?.tripName?.message}
                    </span>
                  )}
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>نوع المجموعة</Form.Label>
                  <Dropdown name="groupType">
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                      {selectedGroupType ? selectedGroupType : "نوع المجموعة"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        type="text"
                        onClick={(e) => {
                          setFlightInformation({
                            ...flightInformation,
                            groupType: "Men",
                          });
                          setSelectedGroupType("رجال");
                        }}
                        value="Men"
                        name="groupType"
                      >
                        رجال
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="text"
                        onClick={(e) => {
                          setFlightInformation({
                            ...flightInformation,
                            groupType: "Women",
                          });
                          setSelectedGroupType("سيدات");
                        }}
                        value="Women"
                        name="groupType"
                      >
                        سيدات
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="text"
                        onClick={(e) => {
                          setFlightInformation({
                            ...flightInformation,
                            groupType: "Families",
                          });
                          setSelectedGroupType("عائلات");
                        }}
                        value="Families"
                        name="groupType"
                      >
                        عائلات
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="text"
                        onClick={(e) => {
                          setFlightInformation({
                            ...flightInformation,
                            groupType: "Students",
                          });
                          setSelectedGroupType("طلاب");
                        }}
                        value="Students"
                        name="groupType"
                      >
                        طلاب
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>نوع الرحلة</Form.Label>
                  <Dropdown name="tripType">
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                      {selectedTripType ? selectedTripType : "نوع الرحلة"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        type="text"
                        onClick={(e) => {
                          setFlightInformation({
                            ...flightInformation,
                            tripType: "Tourism",
                          });
                          setSelectedTripType("سياحية ");
                        }}
                        value="Tourism"
                        name="tripType"
                      >
                        سياحية
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="text"
                        onClick={(e) => {
                          setFlightInformation({
                            ...flightInformation,
                            tripType: "Hunting",
                          });
                          setSelectedTripType("صيد");
                        }}
                        value="Hunting"
                        name="tripType"
                      >
                        صيد
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="text"
                        onClick={(e) => {
                          setFlightInformation({
                            ...flightInformation,
                            tripType: "Therapeutic",
                          });
                          setSelectedTripType("علاجية");
                        }}
                        value="Therapeutic"
                        name="tripType"
                      >
                        علاجية
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="text"
                        onClick={(e) => {
                          setFlightInformation({
                            ...flightInformation,
                            tripType: "Training",
                          });
                          setSelectedTripType("تدريبية");
                        }}
                        value="Training"
                        name="tripType"
                      >
                        تدريبية
                      </Dropdown.Item>
                      <Dropdown.Item
                        type="text"
                        onClick={(e) => {
                          setFlightInformation({
                            ...flightInformation,
                            tripType: "Educational",
                          });
                          setSelectedTripType("تعليمية");
                        }}
                        value="Educational"
                        name="tripType"
                      >
                        تعليمية
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>شعار الرحلة </Form.Label>

                  <Form.Control
                    type="file"
                    name="tripLogo"
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                    {...register("tripLogo", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.files[0],
                        });
                      },
                    })}
                  />
                  {errors && errors?.tripLogo && (
                    <span className="error-msg">
                      {errors?.tripLogo?.message}
                    </span>
                  )}
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>الأحكام والشروط</Form.Label>
                  <Editor
                    name="termsAndConditions"
                    onChange={(data) => {
                      setFlightInformation({
                        ...flightInformation,
                        termsAndConditions: data,
                      });
                      // setData(data);
                    }}
                    editorLoaded={editorLoaded}
                    style={{ height: "134px" }}
                  />

                  {errors && errors?.termsAndConditions && (
                    <span className="error-msg">
                      {errors?.termsAndConditions?.message}
                    </span>
                  )}
                </Col>
              </Row>
            </Form>
          </div>

          <div className="trip-info-form mb-5">
            <p>معلومات التواصل</p>
            <Form>
              <Row>
                <Col xs={12} md={4}>
                  <Form.Label>الاسم</Form.Label>
                  <Form.Control
                    name="name"
                    placeholder="الاسم"
                    {...register("name", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.value,
                        });
                      },
                    })}
                    disabled
                  />
                  {errors && errors?.name && (
                    <span className="error-msg">{errors?.name?.message}</span>
                  )}
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>الرقم</Form.Label>

                  <Form.Control
                    name="phone"
                    placeholder="الرقم"
                    {...register("phone", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.value,
                        });
                      },
                    })}
                    disabled
                  />
                  {errors && errors?.phone && (
                    <span className="error-msg">{errors?.phone?.message}</span>
                  )}
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>الايميل</Form.Label>
                  <Form.Control
                    name="email"
                    placeholder="الايميل"
                    {...register("email", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.value,
                        });
                      },
                    })}
                    disabled
                  />
                  {errors && errors?.email && (
                    <span className="error-msg">{errors?.email?.message}</span>
                  )}
                </Col>
              </Row>
            </Form>
          </div>

          <div className="trip-info-form">
            <p>الوجهه الاولى</p>
            {addDestination?.map((x, i) => {
              const destinationErrors = errors.destinations?.[i] || {};
              return (
                <Form key={i}>
                  <Row>
                    <Col xs={12} md={4}>
                      <Form.Label>مدينة</Form.Label>
                      <Form.Control
                        name={`destinations[${i}].city`}
                        placeholder="مدينة"
                        {...register(`destinations[${i}].city`, {
                          onChange: (e) => {
                            handleInputChange(e, i);
                          },
                        })}
                      />
                      {destinationErrors.city && (
                        <span className="error-msg">
                          {destinationErrors.city.message}
                        </span>
                      )}
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Label>الفنادق‌</Form.Label>
                      <Form.Control
                        name={`destinations[${i}].hotelName`}
                        placeholder="الفنادق‌"
                        {...register(`destinations[${i}].hotelName`, {
                          onChange: (e) => {
                            handleInputChange(e, i);
                          },
                        })}
                      />
                      {destinationErrors.hotelName && (
                        <span className="error-msg">
                          {destinationErrors.hotelName.message}
                        </span>
                      )}
                    </Col>

                    <Col xs={12} md={4}>
                      <Form.Label>التاريخ</Form.Label>

                      <Form.Control
                        name={`destinations[${i}].date`}
                        type="date"
                        disabled
                        placeholder="التاريخ"
                        {...register(`destinations[${i}].date`, {
                          onChange: (e) => {
                            handleInputChange(e, i);
                          },
                        })}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} md={4}>
                      <Form.Label>ليالي‌‌/ ‌‌ليلة</Form.Label>
                      <Form.Control
                        name={`destinations[${i}].duration`}
                        type="number"
                        placeholder="ليالي‌‌/ ‌‌ليلة"
                        {...register(`destinations[${i}].duration`, {
                          onChange: (e) => {
                            handleInputChange(e, i);
                          },
                        })}
                      />
                      {destinationErrors.duration && (
                        <span className="error-msg">
                          {destinationErrors.duration.message}
                        </span>
                      )}
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Label>صور الوجهة</Form.Label>
                      <Form.Control
                        name={`destinations[${i}]?.faceImage`}
                        type="file"
                        {...register(`destinations[${i}].faceImage`, {
                          onChange: (e) => {
                            handleInputChange(e, i);
                          },
                        })}
                        onClick={(e) => {
                          e.target.value = null;
                        }}
                        accept="image/png, image/jpg, image/jpeg,.pdf"
                        multiple
                      />
                      {destinationErrors?.faceImage && (
                        <span className="error-msg">
                          {destinationErrors?.faceImage?.message}
                        </span>
                      )}
                    </Col>
                    <Col xs={12} md={4}>
                      <Form.Label>الاجندة</Form.Label>

                      <Editor
                        name={`destinations[${i}].agenda`}
                        onChange={(data) => {
                          const list = [...addDestination];
                          list[i]["agenda"] = data;
                          setDestination(list);
                        }}
                        style={{ height: "134px" }}
                      />
                    </Col>
                  </Row>
                </Form>
              );
            })}
          </div>

          <div className="add-destination">
            <div className="add-destination-img">
              <Image
                src={add}
                alt=""
                onClick={() => {
                  handleAddDestination();
                }}
              />
              <p>اضافة وجهه جديدة</p>
            </div>
          </div>
          <div className="destination--btn pb-5">
            <button
              // type="button"
              className="cursor-pointer"
              onClick={handleSubmit(addTrip)}
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
