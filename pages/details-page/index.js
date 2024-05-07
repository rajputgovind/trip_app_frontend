import React, { useState, useEffect, useRef } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import Image from "next/image";
import Link from "next/link";
import check from "../../public/doublecheck.svg";
import { useRouter } from "next/router";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import axios from "axios";
import cookie from "js-cookie";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import {
  userJoinRequest,
  getProfileForDocuments,
  registerFunction,
} from "@/ApiServices/apiService";
import Dropdown from "react-bootstrap/Dropdown";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Topbar from "@/components/TopbarAdmin/Topbar";
import formatDate from "../../CommonFunctions/ArabicFormat";
import LoginModal from "../../components/Modals/login";
import SignUpModal from "../../components/Modals/signup";
import { Countries } from "@/countries";
import { TfiReload } from "react-icons/tfi";
import ar from "react-phone-input-2/lang/ar.json";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Head from "next/head";
const index = (data) => {
  const [tripInfo, setTripInfo] = useState();

  const validationSchema = yup.object().shape({
    firstName: tripInfo?.document?.firstName
      ? yup.string().required("الإسم الأول مطلوب")
      : "",
    lastName: tripInfo?.document?.lastName
      ? yup.string().required("إسم العائلة مطلوب")
      : "",
    id: tripInfo?.document?.id
      ? yup.string().required("يجب أن يكون المعرف مطلوبًا")
      : "",

    email: tripInfo?.document?.email
      ? yup
          .string()
          .email("يرجى إدخال البريد الإلكتروني الصحيح")
          .required("البريد الالكتروني مطلوب")
      : "",
    healthIssues: tripInfo?.document?.healthIssues
      ? yup.string().required("يرجى كتابة القضايا الصحية الخاصة بك")
      : "",

    adults: yup
      .number()
      .typeError("لا. يجب أن تكون الشعوب إيجابية")
      .required("مطلوب الكبار")
      .integer("يجب أن يكون البالغون عددًا صحيحًا موجبًا")
      .min(0, "يجب أن يكون عدد البالغين موجبًا"),
    // kids: yup.number().positive("Age must be a positive number").nullable(),
  });
  const validation = yup.object({
    email: yup
      .string()
      .email("البريد الإلكتروني غير صالح")
      .required("البريد الالكتروني مطلوب"),
    password: yup
      .string()
      .min(6, "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل")
      .required("كلمة المرور مطلوبة"),
  });
  const validateSchemaRegistration = yup.object().shape({
    name: yup
      .string()
      .min(3, "يجب أن يكون 3 أحرف أو أكثر")
      .required("مطلوب اسم"),
    email: yup
      .string()
      .email("البريد الإلكتروني غير صالح")
      .required("البريد الالكتروني مطلوب"),

    password: yup
      .string()
      .min(6, "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل")
      .required("كلمة المرور مطلوبة"),

    marketingName: false,
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    reset: reset1,
    formState: { errors: error1 },
  } = useForm({
    resolver: yupResolver(validation),
  });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
    formState: { errors: error2 },
  } = useForm({
    resolver: yupResolver(validateSchemaRegistration),
  });
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [personalModalShow, SetpersonalModalShow] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseModal = () => SetpersonalModalShow(false);
  const handleShowModal = () => SetpersonalModalShow(true);
  const handleCloseConfirm = () => setConfirmModalShow(false);
  const handleShowConfirm = () => setConfirmModalShow(true);
  const [isLoading, setLoading] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [loginconfirmModalShow, setloginconfirmModalShow] = useState(false);
  const loginhandleCloseConfirm = () => setloginconfirmModalShow(false);
  const handleLoginshow = () => setloginconfirmModalShow(true);
  const [stateChange, setStateChange] = useState(false);
  const [signupconfirmModalShow, setsignupconfirmModalshow] = useState(false);
  const signuphandleCloseConfirm = () => setsignupconfirmModalshow(false);
  const handleshowSignupModal = () => setsignupconfirmModalshow(true);
  const [phone, setPhone] = useState("");

  const [userRegistered, setUserRegistered] = useState({
    name: "",
    email: "",
    phone: "",
    // birthDate: "",
    password: "",
    role: data?.data ? data?.data : "",
    confirmPassword: "",

    accept: false,
    marketingName: "",
  });
  const [dataRole, setDataRole] = useState();

  const [options, setOptions] = useState([]);
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const canvasRef = useRef(null);
  const [profileChange, setProfileChange] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const role = cookie.get("role");
    if (role === "Organizer") {
      setIsOrganizer(true);
    }
  }, []);
  const [peopleValues, setPeopleValues] = useState([]);
  const [adultsValues, setAdultsValues] = useState([]);
  const [genderGot, setGenderGot] = useState("");
  const [tripRequest, setTripRequest] = useState({
    id: "",
    passport: "",
    firstName: "",
    lastName: "",
    gender: "",
    phone: "",
    email: "",
    healthIssues: "",
    // birthDate: "",
    age: "",
    // peoples: "",
    // adults: "",
    kids: 0,
    others: "",
  });

  useEffect(() => {
    if (data?.data?.length > 0) {
      setTripInfo(data?.data[0]);
    }
  }, [data]);

  const joinFunction = (status) => {
    const token = cookie.get("token");
    const role = cookie.get("role");
    if (token) {
      if (role === "User") {
        if (status === true) {
          handleShow();
        } else {
          toast.error("التسجيل مغلق");
        }
      } else {
        toast.error("لا يوجد إذن للانضمام بخلاف المستخدم");
      }
    } else {
      reset1();
      reset2();
      handleLoginshow();
      // router.push("/admin/login?User=true");
    }
  };
  const termsCondition = () => {
    const token = cookie.get("token");
    const role = cookie.get("role");
    if (token) {
      if (role === "User") {
        handleClose();
        handleShowModal();
      } else {
        toast.error("لا يوجد إذن للانضمام بخلاف المستخدم");
      }
    } else {
      router.push("/admin/login?User=true");
    }
  };

  const confirmFunction = () => {
    // console.log(!adultsValues?.some((item) => (item?.lastName&&!item?.firstName)))
    let token = cookie.get("token");
    let role = cookie.get("role");
    if (token) {
      if (role !== "User") {
        toast.error("لا يوجد إذن للانضمام بخلاف المستخدم");
      } else {
        if (tripInfo?.document?.gender === true) {
          if (tripRequest?.gender) {
            if (
              !adultsValues?.some((item) => item?.lastName && !item?.firstName)
            ) {
              userJoinRequest(
                token,
                tripRequest,
                router,
                setLoading,
                SetpersonalModalShow,
                setConfirmModalShow,
                tripInfo?._id,
                tripInfo?.user?._id,
                peopleValues,
                adultsValues
              );
            } else {
              toast.error("please write the firstName");
            }
          } else {
            toast.error("حدد الجنس");
          }
        } else {
          if (
            !adultsValues?.some((item) => item?.lastName && !item?.firstName)
          ) {
            userJoinRequest(
              token,
              tripRequest,
              router,
              setLoading,
              SetpersonalModalShow,
              setConfirmModalShow,
              tripInfo?._id,
              tripInfo?.user?._id,
              peopleValues,
              adultsValues
            );
          } else {
            toast.error("please write the firstName");
          }
        }
      }
    } else {
      router.push("/admin/login?User=true");
    }
  };

  useEffect(() => {
    let token = cookie.get("token");

    if (data?.roles) {
      setDataRole(data?.roles.find((role) => role.roleName === "User")?._id);
    }
    if (token) {
      getProfileForDocuments(
        token,
        setTripRequest,
        setLoading,
        router,
        setValue
      );
    }
  }, [profileChange]);

  const handleTripCountChange = (event, status) => {
    const newTripCount = parseInt(event.target.value, 10) || 0;
    setTripRequest({
      ...tripRequest,
      [event.target.name]: newTripCount,
    });
    if (status === true) {
      setPeopleValues((prevTrips) =>
        Array.from(
          { length: newTripCount },
          (_, index) => prevTrips[index] || { age: "", name: "" }
        )
      );
    } else {
      setAdultsValues((prevTrips) =>
        Array.from(
          { length: newTripCount },
          (_, index) => prevTrips[index] || { firstName: "", lastName: "" }
        )
      );
    }
  };
  const isEnglishLetter = (text) => /^[A-Za-z]+$/.test(text);
  const handleInputChange = (index, field, event, status) => {
    if (status === false) {
      if (field === "age") {
        const newTrips = [...peopleValues];
        newTrips[index][field] = event.target.value;
        setPeopleValues(newTrips);
      } else {
        if (!isEnglishLetter(event.target.value)) {
        } else {
          const newTrips = [...peopleValues];
          newTrips[index][field] = event.target.value;
          setPeopleValues(newTrips);
        }
      }
    } else {
      if (!isEnglishLetter(event.target.value)) {
      } else {
        const newTrips = [...adultsValues];
        newTrips[index][field] = event.target.value;
        setAdultsValues(newTrips);
      }
    }
  };
  const generateRandomChar = (min, max) =>
    String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      initializeCaptcha(ctx);
    }
  }, [stateChange]);
  const generateCaptchaText = () => {
    let captcha = "";
    for (let i = 0; i < 2; i++) {
      // captcha += generateRandomChar(65, 90);
      // captcha += generateRandomChar(97, 122);
      captcha += generateRandomChar(48, 57);
      captcha += generateRandomChar(48, 57);
      // captcha += generateRandomChar(48, 57);
    }
    return captcha
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const drawCaptchaOnCanvas = (ctx, captcha) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const textColors = ["rgb(0,0,0)", "rgb(130,130,130)"];
    const letterSpace = 150 / captcha.length;
    for (let i = 0; i < captcha.length; i++) {
      const xInitialSpace = 25;
      ctx.font = "20px Roboto Mono";
      ctx.fillStyle = textColors[Math.floor(Math.random() * 2)];
      ctx.fillText(
        captcha[i],
        xInitialSpace + i * letterSpace,

        // Randomize Y position slightly
        Math.floor(Math.random() * 16 + 25),
        100
      );
    }
  };

  const initializeCaptcha = (ctx) => {
    setUserInput("");
    const newCaptcha = generateCaptchaText();
    setCaptchaText(newCaptcha);
    drawCaptchaOnCanvas(ctx, newCaptcha);
  };

  const handleRegister = (data) => {
    if (userRegistered?.password === userRegistered?.confirmPassword) {
      if (phone.length > 5) {
        if (userRegistered?.accept) {
          if (userInput === captchaText) {
            registerFunction(
              userRegistered,
              dataRole,
              router,
              setLoading,
              phone,
              "User",
              false,
              true,
              setloginconfirmModalShow,
              setsignupconfirmModalshow,
              profileChange,
              setProfileChange
            );
          } else {
            toast.error("Incorrect Text Captcha");
          }
        } else {
          toast.error("يرجى قبول الشروط والأحكام");
        }
      } else {
        toast.error("رقم الهاتف يجب أن يكون أكثر من 5 أرقام ");
      }
    } else {
      toast.error("يجب أن تكون كلمة المرور وتأكيد كلمة المرور متطابقتين");
    }
  };
  const handleInputsRegistration = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;

    setUserRegistered({ ...userRegistered, [name]: value });
  };

 

  return (
    <>
      <div className="container-1920">
        

        <Topbar />
        {isLoading === true ? (
          <div className="loader-box">
            <div className="loader"></div>
          </div>
        ) : (
          ""
        )}
        <div className="breadcrumbs-txt-container-2 px-5 mt-5">
          {isLoading === true ? (
            <div className="loader-box">
              <div className="loader"></div>
            </div>
          ) : (
            ""
          )}
          <p
            onClick={() => {
              router.push("/");
            }}
            className="cursor-pointer"
          >
            الرئيسية
          </p>
          <MdKeyboardArrowLeft />
          <p
            onClick={() => {
              router.push("/search-trip");
            }}
            className="cursor-pointer"
          >
            {" "}
            بحث عن رحلات{" "}
          </p>
          <MdKeyboardArrowLeft />
          <p className="breadcrumbs-active-2">
            {" "}
            {tripInfo?.tripName ? tripInfo?.tripName : ""}{" "}
          </p>
        </div>
        <div className="main-content-detail mt-5">
          <aside>
            <div className="side-2-container">
              <div className="aside-2-img ">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGES}/public/tripImages/${
                    tripInfo?.mainTripImage ? tripInfo.mainTripImage : ""
                  }`}
                />
              </div>
              <p className="side2-title">
                {tripInfo?.tripName ? tripInfo?.tripName : ""}
              </p>
              <div className="side-2-options d-flex justify-content-around">
                <p>
                  الفئة:
                  {tripInfo?.groupType
                    ? tripInfo?.groupType === "Male"
                      ? "ذكر"
                      : tripInfo?.groupType === "Female"
                      ? "أنثى"
                      : "عائلات"
                    : ""}
                </p>
                <p>
                  {" "}
                  <span className="number--days">
                    {" "}
                    {tripInfo?.tripDuration ? tripInfo?.tripDuration : ""}
                  </span>{" "}
                  : ليلة / ليالي‌
                </p>
              </div>
              <p>يشمل الاتي:</p>
              <ul className="hotels-list">
                {tripInfo?.tripIncludes
                  ? tripInfo?.tripIncludes && parse(tripInfo?.tripIncludes)
                  : ""}
              </ul>

              <div className="side-2-btnbox">
                <p className="mb-0">
                  {tripInfo?.tripPrice && tripInfo?.tripPrice}
                </p>
                <button
                  // type="button"
                  onClick={() => {
                    joinFunction(tripInfo?.tripStatus);
                  }}
                >
                  انضم
                </button>
              </div>
            </div>
          </aside>

          <div className="middle-content ">
            <div className="row gy-3 ">
              {tripInfo?.destination
                ? tripInfo?.destination?.map((images, key) => {
                    return images?.destinationImage?.map((image, index) => {
                      return (
                        index == 0 && (
                          <div
                            className="col-lg-6 col-md-12 col-sm-12 "
                            key={index}
                          >
                            <div
                              className="hover-box "
                              onClick={() => {
                                router.push(
                                  `/place-page?id=${tripInfo?._id}&key=${key}`
                                );
                              }}
                            >
                              <div className="middle-content-imgbox cursor-pointer">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_IMAGES}/public/destinationImages/${image}`}
                                  alt="img"
                                />
                              </div>
                              <div className="on-hover-content cursor-pointer">
                                <p>{images?.city ? images?.city : ""}</p>
                              </div>
                            </div>
                          </div>
                        )
                      );
                    });
                  })
                : ""}
             
            </div>
          </div>
          <aside className="side-bar-1 p-3 mt-3">
            <div className="side-bar-title">الرحلة</div>
            <div className="img-title-sidebox">
              <div className="side-titles m-auto">
                {tripInfo?.destination
                  ? tripInfo?.destination?.map((details, index) => {
                      return (
                        <div
                          className="d-flex gap-3 pb-side"
                          key={details?._id}
                        >
                          <div className="hover-effect">
                            <div className="text-center ps-2 venue">
                              <div
                                className={
                                  index + 1 !== tripInfo?.destination?.length
                                    ? "verticle-img-box verticle-line"
                                    : "verticle-img-box"
                                }
                              >
                                {/* <div className="verticle-img-box verticle-line"> */}
                                <img
                                  src={`${process.env.NEXT_PUBLIC_IMAGES}/public/destinationImages/${details?.destinationImage[0]}`}
                                />
                              </div>
                              <p className="hotel-names">
                                {details?.hotelName}
                              </p>
                            </div>

                            <div className="text-center show-hover">
                              <p className="inner-txt mb-1">
                                {details?.city ? details?.city : ""}
                              </p>

                              <p>{formatDate(details?.destinationDate)}</p>
                            </div>
                          </div>
                          <div className="side-hover">
                            <ul className="mt-3">
                              {details?.agenda && parse(details?.agenda)}
                            </ul>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
           
            </div>
          </aside>
        </div>
      </div>
      {/* modal for Terms and Condition */}
      <Modal show={show} onHide={handleClose} className="modal-box">
        <div className="modal-title p-3 d-flex justify-content-end modal-header--sticky">
          <div className="modal-title-txt">
            <h2>الشروط والأحكام</h2>
            <h2 onClick={handleClose} className="mb-0 cross-btn">
              X
            </h2>
          </div>
        </div>
        <div className="p-3 list-text-content">
          {tripInfo?.termAndConditions
            ? parse(tripInfo?.termAndConditions)
            : ""}

          <div className="modal-btn--1 mb-5 mt-4">
            <button
              // type="button"
              onClick={() => {
                termsCondition();
              }}
            >
              ‌الموافقة على الشروط والأحكام‌
            </button>
          </div>
        </div>
      </Modal>
      {/* personal-info modal */}
      <Modal
        show={personalModalShow}
        onHide={handleCloseModal}
        className="modal-box"
      >
        <div className="modal-title p-3 d-flex justify-content-end mb-3 modal-header--sticky">
          <div className="modal-title-txt">
            <h2>المعلومات الشخصية</h2>
            <h2 onClick={handleCloseModal} className="mb-0 cross-btn">
              X
            </h2>
          </div>
        </div>

        <div className="p-3 list-text-content">
          <Form onSubmit={handleSubmit(confirmFunction)}>
            <Row className="mb-5">
              {tripInfo?.document?.firstName
                ? tripInfo?.document?.firstName && (
                    <Col>
                      <Form.Label>الاسم الأول</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        {...register("firstName", {
                          onChange: (e) => {
                            setTripRequest({
                              ...tripRequest,
                              [e.target.name]: e.target.value,
                            });
                          },
                        })}
                      />
                      {errors && errors?.firstName && (
                        <p className="error-msg">
                          {errors?.firstName?.message}
                        </p>
                      )}
                    </Col>
                  )
                : ""}
              {tripInfo?.document?.lastName
                ? tripInfo?.document?.lastName && (
                    <Col>
                      <Form.Label>الاسم الثاني</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        {...register("lastName", {
                          onChange: (e) => {
                            setTripRequest({
                              ...tripRequest,
                              [e.target.name]: e.target.value,
                            });
                          },
                        })}
                      />

                      {errors && errors?.lastName && (
                        <p className="error-msg">{errors?.lastName?.message}</p>
                      )}
                    </Col>
                  )
                : ""}
            </Row>
            <Row className="mb-5">
              {tripInfo?.document?.phone
                ? tripInfo?.document?.phone && (
                    <Col>
                      <Form.Label>رقم الجوال</Form.Label>
                      <Form.Control
                        type="phone"
                        name="phone"
                        {...register("phone", {
                          onChange: (e) => {
                            setTripRequest({
                              ...tripRequest,
                              [e.target.name]: e.target.value,
                            });
                          },
                        })}
                      />
                    </Col>
                  )
                : ""}
              {tripInfo?.document?.gender
                ? tripInfo?.document?.gender && (
                    <Col>
                      <Form.Label>الجنس</Form.Label>

                      <Dropdown>
                        <Dropdown.Toggle variant="light" id="dropdown-basic">
                          {/* {tripRequest?.gender ? tripRequest?.gender : "حدد نوع الجنس"} */}
                          {genderGot ? genderGot : "حدد نوع الجنس"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={(e) => {
                              setTripRequest({
                                ...tripRequest,
                                gender: "Male",
                              });
                              setGenderGot("ذكر");
                            }}
                          >
                            ذكر
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={(e) => {
                              setTripRequest({
                                ...tripRequest,
                                gender: "Female",
                              });
                              setGenderGot("أنثى");
                            }}
                          >
                            أنثى
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>

                      {errors && errors?.gender && (
                        <p className="error-msg">{errors?.gender?.message}</p>
                      )}
                    </Col>
                  )
                : ""}
            </Row>
            <Row className="pb-3 ">
              {tripInfo?.document?.email
                ? tripInfo?.document?.email && (
                    <Col>
                      <Form.Label>الايميل</Form.Label>
                      <Form.Control
                        name="email"
                        type="email"
                        disabled
                        {...register("email", {
                          onChange: (e) => {
                            setTripRequest({
                              ...tripRequest,
                              [e.target.name]: e.target.value,
                            });
                          },
                        })}
                      />
                      {errors && errors?.email && (
                        <p className="error-msg">{errors?.email?.message}</p>
                      )}
                    </Col>
                  )
                : ""}
            </Row>

            <Row className="pb-3 ">
              {tripInfo?.document?.healthIssues
                ? tripInfo?.document?.healthIssues && (
                    <Col>
                      <Form.Label> مشاكل صحية</Form.Label>
                      <Form.Control
                        type="text"
                        name="healthIssues"
                        {...register("healthIssues", {
                          onChange: (e) => {
                            setTripRequest({
                              ...tripRequest,
                              [e.target.name]: e.target.value,
                            });
                          },
                        })}
                      />
                      {errors && errors?.healthIssues && (
                        <p className="error-msg">
                          {errors?.healthIssues?.message}
                        </p>
                      )}
                    </Col>
                  )
                : ""}
              {tripInfo?.document?.id
                ? tripInfo?.document?.id && (
                    <Col>
                      <Form.Label>بطاقة تعريف</Form.Label>
                      <Form.Control
                        type="text"
                        name="id"
                        {...register("id", {
                          onChange: (e) => {
                            setTripRequest({
                              ...tripRequest,
                              [e.target.name]: e.target.value,
                            });
                          },
                        })}
                      />

                      {errors && errors?.id && (
                        <p className="error-msg">{errors?.id?.message}</p>
                      )}
                    </Col>
                  )
                : ""}
            </Row>
            <Row className="pb-3 ">
              <Col>
                <Form.Label> ‌طلبات خاصة‌ ‌</Form.Label>
                <Form.Control
                  as="textarea"
                  name="passport"
                  style={{ height: "100px" }}
                  onChange={(e) => {
                    setTripRequest({
                      ...tripRequest,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
              </Col>

              <Col>
                <Form.Label>عمر</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  onChange={(e) => {
                    setTripRequest({
                      ...tripRequest,
                      [e.target.name]: e.target.value,
                    });
                  }}
                />
              </Col>
            </Row>
            {/* new design */}
            <Row>
              <Col>
                <Form.Label>عدد الاشخاص</Form.Label>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <div className="boxes--people d-flex gap-3 align-items-center">
                  <p className="mb-0">أطفال</p>
                  <Form.Control
                    type="number"
                    name="kids"
                    defaultValue={null}
                    {...register("kids", {
                      onChange: (e) => {
                        handleTripCountChange(e, true);
                      },
                    })}
                  />
                </div>
                {errors && errors?.kids && (
                  <p className="error-msg">{errors?.kids?.message}</p>
                )}
              </Col>

              <Col className="">
                <div className="boxes--people d-flex gap-3 align-items-center">
                  <p className="mb-0">الكبار</p>
                  <Form.Control
                    type="number"
                    name="adults"
                    {...register("adults", {
                      onChange: (e) => {
                        handleTripCountChange(e, false);
                      },
                    })}
                  />
                </div>
                {errors && errors?.adults && (
                  <p className="error-msg">{errors?.adults?.message}</p>
                )}
              </Col>
            </Row>
            {peopleValues?.length > 0 &&
              peopleValues.map((value, index) => {
                return (
                  <Row className="mt-3" key={index}>
                    <Col>
                      <p className="mb-0"> عمر الطفل</p>
                      <Form.Control
                        type="number"
                        value={value?.age}
                        onChange={(e) =>
                          handleInputChange(index, "age", e, false)
                        }
                      />
                    </Col>
                    <Col>
                      <p className="mb-0">اسم الطفل</p>
                      <Form.Control
                        type="text"
                        value={value?.name}
                        onChange={(e) =>
                          handleInputChange(index, "name", e, false)
                        }
                      />
                    </Col>
                  </Row>
                );
              })}

            {adultsValues?.length > 0 &&
              adultsValues.map((value, index) => {
                return (
                  <Row className="mt-3" key={index}>
                    <Col>
                      <p className="mb-0">الاسم الأول للبالغين</p>
                      <Form.Control
                        type="text"
                        value={value?.firstName}
                        onChange={(e) =>
                          handleInputChange(index, "firstName", e, true)
                        }
                      />
                    </Col>
                    <Col>
                      <p className="mb-0">الاسم الأخير للبالغين</p>
                      <Form.Control
                        type="text"
                        value={value?.lastName}
                        onChange={(e) =>
                          handleInputChange(index, "lastName", e, true)
                        }
                      />
                    </Col>
                  </Row>
                );
              })}
            <Row>
              <Col>
                <div className="modal-btn--1 mt-4 mb-4">
                  <button type="submit">‌تأكيد‌ ‌ ‌الطلب </button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

      {/* confirmModalShow */}
      <Modal
        show={confirmModalShow}
        onHide={handleCloseConfirm}
        className="modal-box"
      >
        <div className="modal-title p-3 mb-3 modal-header--sticky">
          <div className="modal-title-txt-2 d-flex justify-content-center ">
            <h2>طلب الانضمام</h2>
          </div>
        </div>

        <div className="p-3">
          <div className="text-content--2 mt-6">
            <h2>
              <span>‌في إنتظار موافقة منظم الرحلة‌ </span>
            </h2>
          </div>
          <div className="confirm-img-box d-flex justify-content-center">
            <Image src={check} alt="" />
          </div>
          <div className="modal-btn--1 mb-5">
            <button
              // type="button"
              onClick={() => {
                router.push("/my-trip");
              }}
            >
              تفاصيل رحلتي
            </button>
          </div>
        </div>
      </Modal>
      <LoginModal
        loginconfirmModalShow={loginconfirmModalShow}
        loginhandleCloseConfirm={loginhandleCloseConfirm}
        handleshowSignupModal={handleshowSignupModal}
        user={user}
        setLoading={setLoading}
        setUser={setUser}
        router={router}
        register1={register1}
        handleSubmit1={handleSubmit1}
        error1={error1}
        setStateChange={setStateChange}
        stateChange={stateChange}
        reset2={reset2}
        path={data?.path}
        profileChange={profileChange}
        setProfileChange={setProfileChange}
      />

      <Modal
        show={signupconfirmModalShow}
        onHide={signuphandleCloseConfirm}
        className="modal-box"
      >
        <div className="modal-title p-3 mb-0 modal-header--sticky">
          <div className="modal-title-txt-2 d-flex ">
            <div className="signup-btn--box mb-0">
              <button
                className="mb-0 text-white text-bold bg-transparent border-0"
                onClick={signuphandleCloseConfirm}
              >
                X
              </button>
            </div>
            <h2 className="text-center">اشتراك</h2>
          </div>
        </div>

        <div className="mt-0">
          <p className="login-from-title-admin ">انشاء حساب</p>
          <div className="login-form--subcontainer">
            <Form onSubmit={handleSubmit2(handleRegister)}>
              <Row>
                <Col>
                  <Form.Label>الاسم</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="الاسم"
                    name="name"
                    value={userRegistered?.name ? userRegistered?.name : ""}
                    {...register2("name", {
                      onChange: (e) => {
                        handleInputsRegistration(e);
                      },
                    })}
                  />
                  {error2 && error2?.name && (
                    <p className="error-msg">{error2?.name?.message}</p>
                  )}
                </Col>
                <Col>
                  <Form.Label>الايميل</Form.Label>
                  <Form.Control
                    {...register2("email", {
                      onChange: (e) => {
                        handleInputsRegistration(e);
                      },
                    })}
                    type="email"
                    placeholder="الايميل"
                    name="email"
                    value={userRegistered?.email ? userRegistered?.email : ""}
                  />
                  {error2 && error2?.email && (
                    <p className="error-msg">{error2?.email?.message}</p>
                  )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>كلمة المرور</Form.Label>
                  <Form.Control
                    {...register2("password", {
                      onChange: (e) => {
                        handleInputsRegistration(e);
                      },
                    })}
                    type="password"
                    placeholder="كلمة المرور"
                    name="password"
                    value={
                      userRegistered?.password ? userRegistered?.password : ""
                    }
                  />
                  {error2 && error2?.password && (
                    <p className="error-msg">{error2?.password?.message}</p>
                  )}
                </Col>
                <Col>
                  <Form.Label>تأكيد كلمة المرور</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="تأكيد كلمة المرور"
                    name="confirmPassword"
                    onChange={(e) => {
                      handleInputsRegistration(e);
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Label>رقم الجوال</Form.Label>
                  <PhoneInput
                    country={"us"}
                    enableSearch={true}
                    value={phone}
                    required={true}
                    onChange={(phone) => {
                      setPhone(phone);
                    }}
                    localization={ar}
                  />
                </Col>
              </Row>

              <div className="condition-box">
                <div className="mt-3 d-flex align-items-center gap-2">
                  <Link
                    href="/termsCondition"
                    target="_blank"
                    className="mb-0 curosr-pointer"
                  >
                    الموافقة على الأحكام والشروط‌
                  </Link>
                  <input
                    type="checkbox"
                    checked={userRegistered?.accept}
                    name="accept"
                    onChange={(e) => {
                      setUserRegistered({
                        ...userRegistered,
                        [e.target.name]: !userRegistered?.accept,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="">
                <div className="wrapper captcha-wrapper p-3">
                  <canvas
                    className="canvas-color-blue"
                    ref={canvasRef}
                    width="200"
                    height="50"
                  ></canvas>
                  <button
                    className="reload-btn"
                    id="reload-button"
                    // type="button"
                    onClick={() =>
                      initializeCaptcha(canvasRef.current.getContext("2d"))
                    }
                  >
                    <TfiReload />
                  </button>
                </div>
                <input
                  className="user--input items-center justify-center "
                  type="text"
                  id="user-input"
                  placeholder="أدخل النص أعلاه  "
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </div>
              <div className="form-btn-admin">
                <button type="submit" className="flex items-center gap-2">
                  انشاء حساب
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export async function getServerSideProps(context) {
  try {
    if (context.query.id) {
      let singleTrip = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/trips/get-single-trip/${context.query.id}`
      );
      let getRole = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/roles/get-role`
      );
      return {
        props: {
          data: singleTrip?.data?.data ? singleTrip?.data?.data : "",
          path: context.req.headers.referer ? context.req.headers.referer : "",
          roles: getRole?.data?.data ? getRole?.data?.data : "",
        },
      };
    } else {
      return {
        props: {
          data: "",
          path: "",
          roles: "",
        },
      };
    }
  } catch (err) {
    return { props: {} };
  }
}
export default index;
