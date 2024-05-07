import Header from "@/components/HeaderSection/Header";
import React, { useState, useEffect, useContext } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import add from "../../../public/addimg.svg";
import Image from "next/image";
import { toast } from "react-toastify";
import Select from "react-select";
import { useRouter } from "next/router";
import { MyContext } from "../../../MyContext";

import cookie from "js-cookie";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Dropdown from "react-bootstrap/Dropdown";
import { Countries } from "@/countries";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";

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
  phone: yup
    .string()
    .label("رقم الهاتف المحمول")

    .required("رقم الهاتف مطلوب"),
  tripName: yup.string().required("اسم الرحلة مطلوب"),

  // destinations: yup.array().of(
  //   yup.object().shape({
  //     city: yup.string().required("المدينة مطلوبة"),
  //     hotelName: yup.string().required("يجب أن يكون اسم الفندق مطلوبًا"),

  //     duration: yup.string().required("المدة مطلوبة"),
  //   })
  // ),
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
const index = (data) => {
  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const {
    flightInformation,
    setFlightInformation,
    editDestination,
    setEditDestination,
  } = useContext(MyContext);
  const router = useRouter();

  const handleAddDestination = () => {
    if (
      editDestination[editDestination.length - 1]?.date &&
      editDestination[editDestination.length - 1]?.duration
    ) {
      setEditDestination([
        ...editDestination,
        {
          duration: "",
          date: "",
          city: "",
          agenda: "",
          faceImage: [],
          hotelName: "",
          image:0
        },
      ]);
    } else {
      toast.error("الرجاء اضافة الرقم السابق من الليالي");
    }
  };
  const [selectedTripType, setSelectedTripType] = useState("");

  const [selectedGroupType, setSelectedGroupType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const [options, setOptions] = useState([]);
  const [optionsSet, setOptionSet] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [stateDataChange, setStateChange] = useState(true);
  const [currencyOptionsData, setCurrencyOptionsData] = useState([]);

  const handleInputChange = (e, index) => {
    if (e.target.name.split(".")[1] !== "faceImage") {
      const name = e.target.name.split(".")[1];
      const { value } = e.target;
      const list = [...editDestination];

      list[index][name] = value;
      setEditDestination(list);
    } else {
      const fileList = e.target.files;

      const filesArray = Array.from(fileList);
      const name = e.target.name.split(".")[1];

      const list = [...editDestination];
      list[index][name] = filesArray;
      setEditDestination(list);
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
      !editDestination.some(
        (destination) =>
          !destination.agenda ||
          !destination.hotelName ||
          !destination.city ||
          !destination.duration
      )
    ) {
      if (
        !(editDestination.some(
          (destination) =>
            destination?.image === 0 && destination?.faceImage?.length == 0
        )
      )) {
        if (
          flightInformation?.image === null &&
          flightInformation?.mainTripDummy === null
        ) {
          toast.error("إضافة صورة الرحلة الرئيسية");
        } else {
          if (
            flightInformation?.tripLogo === null &&
            flightInformation?.logoTripDummy === null
          ) {
            toast.error("إضافة شعار الرحلة");
          } else {
            if (editDestination?.length !== 0) {
              router.push(
                `/admin/user-info-Page?id=${data?.data?.data[0]?._id}`
              );
            } else {
              toast.error("يجب أن تكون الوجهة مطلوبة");
            }
          }
        }
      } else {
        toast.error("يرجى إضافة صور الوجهة");
      }
    } else {
      toast.error("يرجى ملء النموذج الكامل");
    }
  };
  useEffect(() => {
    let token = cookie.get("token");
    if (token) {
      let role = cookie.get("role");
      if (role === "Organizer") {
      } else {
        router.push("/admin/login?User=false");
      }
    } else {
      router.push("/admin/login?User=true");
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
  const setTheOptions = () => {
    if (data?.data) {
      setOptionSet(
        Countries?.map((country) => {
          return country?.name === data?.data?.data[0]?.country
            ? {
                label: country.nameAr,
                value: country?.name,
              }
            : "";
        })
      );
    }
  };

  const settingAllInfo = () => {
    const formattedDate = new Date(data?.data?.data[0]?.tripDate)
      .toISOString()
      .split("T")[0];

    setFlightInformation({
      country: data?.data?.data[0]?.country,
      date: formattedDate,
      duration: data?.data?.data[0]?.tripDuration,
      tripIncludes: data?.data?.data[0]?.tripIncludes,
      price: data?.data?.data[0]?.tripPrice,
      email: data?.data?.data[0]?.user?.email,
      name: data?.data?.data[0]?.user?.name,
      phone: data?.data?.data[0]?.user?.phone,
      tripName: data?.data?.data[0]?.tripName,
      groupType: data?.data?.data[0]?.groupType,
      tripType: data?.data?.data[0]?.tripType,
      image: data?.data?.data[0]?.mainTripImage,
      termsAndConditions: data?.data?.data[0]?.termAndConditions,
      currency: data?.data?.data[0]?.tripPrice?.replace(/[0-9]/g, ""),
      tripLogo: data?.data?.data[0]?.tripLogo,
    });
    setSelectedGroupType(data?.data?.data[0]?.groupType);
    setSelectedTripType(data?.data?.data[0]?.tripType);
    setValue("country", data?.data?.data[0]?.country);
    setValue("date", formattedDate);
    setValue("tripIncludes", data?.data?.data[0]?.tripIncludes);
    setValue("price", data?.data?.data[0]?.tripPrice?.split(" ")[0]);
    setValue("email", data?.data?.data[0]?.user?.email);
    setValue("name", data?.data?.data[0]?.user?.name);
    setValue("phone", data?.data?.data[0]?.user?.phone);
    setValue("tripName", data?.data?.data[0]?.tripName);
    setValue("duration", data?.data?.data[0]?.tripDuration);

    for (let i = 0; i < data?.data?.data[0]?.destination?.length; i++) {
      const newObject = {
        id: data?.data?.data[0]?.destination[i]._id,
        duration: data?.data?.data[0]?.destination[i]?.duration,
        date: new Date(data?.data?.data[0]?.destination[i]?.destinationDate)
          .toISOString()
          .split("T")[0],
        city: data?.data?.data[0]?.destination[i]?.city,
        agenda: data?.data?.data[0]?.destination[i]?.agenda,
        image: data?.data?.data[0]?.destination[i]?.destinationImage?.length,
        hotelName: data?.data?.data[0]?.destination[i]?.hotelName,
        faceImage: [],
      };
      if (editDestination?.length > 0) {
        if (
          !editDestination?.some(
            (destination) => destination?.id === newObject?.id
          )
        ) {
          editDestination.push(newObject);
        }
      } else {
        editDestination.push(newObject);
      }
    }
  };
  useEffect(() => {
    setTheOptions();
    settingAllInfo();
  }, []);

  useEffect(() => {
    setCurrencyOptions([
      { label: "‌ريال سعودي ", value: "‌ريال سعودي" },
      { label: "‌دينار كويتي ", value: "‌دينار كويتي" },
      { label: "‌دينار بحريني ", value: "‌دينار بحريني" },
      { label: "‌دولار امريكي ", value: "‌دولار امريكي" },
      { label: "يورو", value: "يورو" },
    ]);
  }, []);

  const arabicToEnglishDictionary = {
    "‌ريال سعودي": "Saudi Riyal",
    "‌دينار كويتي": "Kuwaiti dinar",
    "‌دينار بحريني": "Bahraini dinar",
    "‌دولار امريكي": "US dollar",
    يورو: "Euro",
  };

  useEffect(() => {
    if (currencyOptions.length > 0) {
      setCurrencyOptionsData(
        currencyOptions?.map((options) => {
          const text = arabicToEnglishDictionary[options?.value];
          const text2 =
            arabicToEnglishDictionary[
              data?.data?.data[0]?.tripPrice.replace(/[0-9]/g, "")
            ];
          const dataFound = String(
            data?.data?.data[0]?.tripPrice.replace(/[0-9]/g, "").trim()
          );

          return (
            text === arabicToEnglishDictionary[dataFound] && {
              label: options?.label,
              value: options?.value,
            }
          );
        })
      );
    }
  }, [currencyOptions]);
  useEffect(() => {
    if (flightInformation?.date) {
      const newDate = new Date(flightInformation?.date);
      if (flightInformation?.duration) {
        newDate.setDate(newDate.getDate());

        const dataDate = new Date(newDate).toISOString().split("T")[0];

        setValue("destinations[0].date", dataDate);
        if (dataDate) {
          if (editDestination[0]) {
            editDestination[0].date = dataDate;
          }
        }
        setStateChange(!stateDataChange);
      } else {
        newDate.setDate(newDate.getDate() + Number(0));
        setFlightInformation({ ...flightInformation, duration: 0 });
        setValue("duration", 0);
        const dataDate = new Date(newDate).toISOString().split("T")[0];

        setValue("destinations[0].date", dataDate);
        if (editDestination[0]) {
          editDestination[0].date = dataDate;
        }
        setStateChange(!stateDataChange);
      }
    }
  }, [flightInformation?.duration, flightInformation?.date]);

  useEffect(() => {
    for (let i = 0; i < editDestination.length - 1; i++) {
      if (editDestination[i].date && editDestination[i].duration) {
        const newDate = new Date(editDestination[i].date);
        newDate.setDate(
          newDate.getDate() + Number(editDestination[i].duration)
        );
        const dataDate = new Date(newDate).toISOString().split("T")[0];

        editDestination[i + 1].date = dataDate;
        setValue(`destinations[${i + 1}.date`, dataDate);
      }
    }
  }, [editDestination, stateDataChange]);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const setEditorFunction = () => {
    setEditorLoaded(true);
    let pageData = cookie.get("pageData");

    if (pageData === "true") {
      cookie.set("pageData", false);
      router.reload();
    }
  };
  useEffect(() => {
    setEditorFunction();
  }, []);

  const handleRemoveDestination = (index) => {
    const list = [...editDestination];
    list.splice(index, 1);
    setEditDestination(list);
  };

  return (
    <>
      <Header />
      {/* <ProfileHeader /> */}
      <div className="trip-info-bg-section">
        <div className="container">
          <div
            className="breadcrumbs-txt-container pt-5  cursor-pointer"
            onClick={() => {
              router.push(`/admin/trip-info`);
            }}
          >
            <p>إنشاء رحلات</p>
            <MdKeyboardArrowLeft />
            <p
              className="breadcrumbs-active cursor-pointer"
             
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
                    {optionsSet?.length !== 0 ? (
                      <Select
                        isClearable
                        name="country"
                        placeholder="الدولة"
                        value={optionsSet}
                        styles={MultiSelectcustomStyles}
                        options={options}
                        onChange={(e) => {
                          if (e) {
                            setFlightInformation({
                              ...flightInformation,
                              country: e?.value,
                            });
                            setSelectedCountry(e?.label);
                            setOptionSet([]);
                          } else {
                            setFlightInformation({
                              ...flightInformation,
                              country: "",
                            });
                            setSelectedCountry("");
                            setOptionSet([]);
                          }
                        }}
                      />
                    ) : (
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
                    )}
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <Form.Label>التاريخ</Form.Label>

                  <Form.Control
                    name="date"
                    type="date"
                    value={flightInformation?.date}
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
                  <Form.Label>المدة</Form.Label>

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
                      setFlightInformation({
                        ...flightInformation,
                        mainTripDummy: null,
                      });
                    }}
                    onChange={(e) => {
                      flightInformation.image = null;

                      setFlightInformation({
                        ...flightInformation,
                        mainTripDummy: e.target.files[0],
                      });
                    }}
                  />
                  {flightInformation?.image !== null ? (
                    <span>{flightInformation?.image}</span>
                  ) : (
                    ""
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
                    value={flightInformation?.tripIncludes}
                    editorLoaded={editorLoaded}
                    style={{ height: "134px" }}
                  />
                </Col>
              </Row>
              <Row>
                <Form.Label>عملة </Form.Label>
                <Col xs={12} md={4}>
                  <div className="search-select">
                    {currencyOptionsData?.length > 0 ? (
                      <Select
                        isClearable
                        value={currencyOptionsData}
                        name="currency"
                        placeholder="عملة"
                        styles={MultiSelectcustomStyles}
                        options={currencyOptions}
                        onChange={(e) => {
                          if (e) {
                            setCurrencyOptionsData([]);
                            setFlightInformation({
                              ...flightInformation,
                              currency: e.value,
                            });
                          } else {
                            setCurrencyOptionsData([]);
                            setFlightInformation({
                              ...flightInformation,
                              currency: "",
                            });
                          }
                        }}
                      />
                    ) : (
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
                    )}
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
                      setFlightInformation({
                        ...flightInformation,
                        logoTripDummy: null,
                      });
                    }}
                    {...register("tripLogo", {
                      onChange: (e) => {
                        flightInformation.tripLogo = null;

                        setFlightInformation({
                          ...flightInformation,
                          logoTripDummy: e.target.files[0],
                        });
                      },
                    })}
                  />
                  {flightInformation?.tripLogo !== null ? (
                    <span>{flightInformation?.tripLogo}</span>
                  ) : (
                    ""
                  )}
                  {/* {errors && errors?.tripLogo && (
                    <span className="error-msg">
                      {errors?.tripLogo?.message}
                    </span>
                  )} */}
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
                    value={flightInformation?.termsAndConditions}
                    editorLoaded={editorLoaded}
                    style={{ height: "134px" }}
                  />
                  {/* <Form.Control
                    as="textarea"
                    name="termsAndConditions"
                    style={{ height: "100px" }}
                    // onClick={(e) => {
                    //   e.target.value = null;
                    // }}
                    {...register("termsAndConditions", {
                      onChange: (e) => {
                        setFlightInformation({
                          ...flightInformation,
                          [e.target.name]: e.target.value,
                        });
                      },
                    })}
                  /> */}
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
            {editDestination?.map((x, i) => {
              // const destinationErrors = errors.destinations?.[i] || {};
              return (
                <>
                  <Form key={i}>
                    <Row>
                      <Col xs={12} md={4}>
                        <Form.Label>ليالي‌‌/ ‌‌ليلة</Form.Label>
                        <Form.Control
                          name="destinations[${i}].duration"
                          value={x?.duration}
                          type="number"
                          onChange={(e) => handleInputChange(e, i)}
                          // {...register(`destinations[${i}].duration`, {
                          //   onChange: (e) => {
                          //     handleInputChange(e, i);
                          //   },
                          // })}
                        />
                        {/* {destinationErrors.duration && (
                          <span className="error-msg">
                            {destinationErrors.duration.message}
                          </span>
                        )} */}
                      </Col>
                      <Col xs={12} md={4}>
                        <Form.Label>التاريخ</Form.Label>

                        <Form.Control
                          name="destinations[${i}].date"
                          type="date"
                          value={x.date}
                          {...register(`destinations[${i}].date`, {
                            onChange: (e) => {
                              handleInputChange(e, i);
                            },
                          })}
                          // onChange={(e)=> handleInputChange(e, i)}
                          disabled
                          // onChange={(e) => {
                          //   handleInputChange(e, i);
                          // }}
                        />
                        {/* {destinationErrors.date && (
                          <span className="error-msg">
                            {destinationErrors.date.message}
                          </span>
                        )} */}
                      </Col>
                      <Col xs={12} md={4}>
                        <Form.Label>مدينة</Form.Label>
                        <Form.Control
                          name="destinations[${i}].city"
                          value={x.city}
                          onChange={(e) => handleInputChange(e, i)}
                          // {...register(`destinations[${i}].city`, {
                          //   onChange: (e) => {
                          //     handleInputChange(e, i);
                          //   },
                          // })}
                        />
                        {/* {destinationErrors.city && (
                          <span className="error-msg">
                            {destinationErrors.city.message}
                          </span>
                        )} */}
                      </Col>
                    </Row>

                    <Row>
                      <Col xs={12} md={4}>
                        <Form.Label>صورة للوجهه</Form.Label>
                        <Form.Control
                          name={`destinations[${i}].faceImage`}
                          type="file"
                          onChange={(e) => {
                            editDestination[i].image = 0;
                            handleInputChange(e, i);
                          }}
                          onClick={(e) => {
                            e.target.value = null;
                            editDestination[i].image = 0;
                            editDestination[i].faceImage = [];
                          }}
                          accept="image/png, image/jpg, image/jpeg,.pdf"
                          multiple
                        />
                        {editDestination[i]?.image !== 0
                          ? editDestination[i]?.image + "تم العثور على الصور"
                          : ""}
                        {/* {destinationErrors?.faceImage && (
                        <span className="error-msg">
                          {destinationErrors?.faceImage?.message}
                        </span>
                      )} */}
                      </Col>

                      <Col xs={12} md={4}>
                        <Form.Label>الفنادق‌</Form.Label>
                        <Form.Control
                          name={`destinations[${i}].hotelName`}
                          placeholder="الفنادق‌"
                          value={x?.hotelName}
                          onChange={(e) => handleInputChange(e, i)}
                          // {...register(`destinations[${i}].hotelName`, {
                          //   onChange: (e) => {
                          //     handleInputChange(e, i);
                          //   },
                          // })}
                        />
                        {/* {destinationErrors.hotelName && (
                          <span className="error-msg">
                            {destinationErrors.hotelName.message}
                          </span>
                        )} */}
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} md={4}>
                        <Form.Label>الاجندة</Form.Label>
                        <Editor
                          name={`destinations[${i}].agenda`}
                          onChange={(data) => {
                            const list = [...editDestination];
                            list[i]["agenda"] = data;
                            setEditDestination(list);
                          }}
                          value={editDestination[i]?.agenda}
                          // setEditorLoaded={setEditorLoaded}
                          // editorLoaded={editorLoaded}
                          style={{ height: "134px" }}
                        />
                        {/* <textarea rows="4"/> */}
                      </Col>
                    </Row>
                  </Form>
                  {editDestination?.length !== 1 && (
                    <div className="create-trip-del-btn">
                      <button
                        // type="button"
                        onClick={() => {
                          handleRemoveDestination(i);
                        }}
                      >
                        <AiFillDelete />
                      </button>
                    </div>
                  )}
                </>
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
export async function getServerSideProps(context) {
  const id = context.params.editInfo;
  try {
    if (id) {
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/trips/get-single-trip/${id}`
      );
      return {
        props: {
          data: data?.data,
        },
      };
    } else {
      return {
        props: {
          data: "",
        },
      };
    }
  } catch (err) {
    return {
      props: {},
    };
  }
}
export default index;
