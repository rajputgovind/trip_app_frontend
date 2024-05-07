import Header from "@/components/HeaderSection/Header";
import React, { useEffect, useState, useRef } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { getRoles, registerFunction } from "../../../ApiServices/apiService";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import Dropdown from "react-bootstrap/Dropdown";
import { Countries } from "@/countries";
import { TfiReload } from "react-icons/tfi";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import Link from "next/link";


// Import the Arabic localization for the country names
import ar from "react-phone-input-2/lang/ar.json";
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
  const validateSchema = yup.object().shape({
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

   
    marketingName:
      data?.role && data?.role.includes("Organizer")
        ? yup
            .string()

            .required("يجب أن يكون اسم التسويق مطلوبًا")
        : "",
  });
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validateSchema),
  });
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
   
    password: "",
    role: data?.data ? data?.data : "",
    confirmPassword: "",
  
    accept: false,
    marketingName: "",
  });
  // const [value, setValue] = useState();
  const [dataRole, setDataRole] = useState();
  const [options, setOptions] = useState([]);
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const canvasRef = useRef(null);
  const handleInputs = (e) => {
    let name, value;
    name = e.target.name;
    value = e.target.value;

    setUser({ ...user, [name]: value });
  };

  const handleRegister = (data) => {
    if (user?.password === user?.confirmPassword) {
      if (phone.length > 5) {
        if (user?.accept) {
          if (userInput === captchaText) {
            registerFunction(
              data,
              user?.role,
              router,
              setLoading,
              phone,

              dataRole,
              user?.marketingName
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
  useEffect(() => {
    let token = cookie.get("token");
    if (token) {
      router.push("/");
    }
    if (data?.role) {
      setDataRole(data?.role);
    }
  }, [data]);
  useEffect(() => {
    setOptions(
      Countries.map((country) => {
        return {
          label: country?.nameAr,
          value: country?.name,
        };
      })
    );
  }, []);

  //captcha code
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    initializeCaptcha(ctx);
  }, []);

  const generateRandomChar = (min, max) =>
    String.fromCharCode(Math.floor(Math.random() * (max - min + 1) + min));

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

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <>
      <Header />
      <div className="admin-signup-bg">
        {loading === true ? (
          <div className="loader-box">
            <div className="loader"></div>
          </div>
        ) : (
          ""
        )}
        <div className="container-fluid">
          <div className="signup-form">
            <p className="signup-title">انشاء حساب</p>
            <div className="signup-form-container">
              <Form onSubmit={handleSubmit(handleRegister)}>
                <Row>
                  <Col>
                    <Form.Label>الاسم</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="الاسم"
                      name="name"
                      value={user?.name ? user?.name : ""}
                      {...register("name", {
                        onChange: (e) => {
                          handleInputs(e);
                        },
                      })}
                    />
                    {errors && errors?.name && (
                      <p className="error-msg">{errors?.name?.message}</p>
                    )}
                  </Col>
                  <Col>
                    <Form.Label>الايميل</Form.Label>
                    <Form.Control
                      {...register("email", {
                        onChange: (e) => {
                          handleInputs(e);
                        },
                      })}
                      type="email"
                      placeholder="الايميل"
                      name="email"
                      value={user?.email ? user?.email : ""}
                    />
                    {errors && errors?.email && (
                      <p className="error-msg">{errors?.email?.message}</p>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>كلمة المرور</Form.Label>
                    <Form.Control
                      {...register("password", {
                        onChange: (e) => {
                          handleInputs(e);
                        },
                      })}
                      type="password"
                      placeholder="كلمة المرور"
                      name="password"
                      value={user?.password ? user?.password : ""}
                    />
                    {errors && errors?.password && (
                      <p className="error-msg">{errors?.password?.message}</p>
                    )}
                  </Col>
                  <Col>
                    <Form.Label>تأكيد كلمة المرور</Form.Label>
                    <Form.Control
                      {...register("confirmPassword", {
                        onChange: (e) => {
                          handleInputs(e);
                        },
                      })}
                      type="password"
                      placeholder="تأكيد كلمة المرور"
                      name="confirmPassword"
                      onChange={(e) => {
                        handleInputs(e);
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
                <Row>
                  {data?.role && data?.role.includes("Organizer") && (
                    <Col>
                      <Form.Label> اسم التسويق</Form.Label>
                      <Form.Control
                        {...register("marketingName", {
                          onChange: (e) => {
                            handleInputs(e);
                          },
                        })}
                        type="text"
                        placeholder="اسم التسويق "
                        name="marketingName"
                        value={user?.marketingName ? user?.marketingName : ""}
                      />
                      {errors && errors?.marketingName && (
                        <p className="error-msg">
                          {errors?.marketingName?.message}
                        </p>
                      )}
                    </Col>
                  )}
                  <Col>  </Col>
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
                      checked={user?.accept}
                      name="accept"
                      onChange={(e) => {
                        setUser({ ...user, [e.target.name]: !user?.accept });
                      }}
                    />
                  </div>
                </div>
                <div className=" captcha-content">
                  <div className="wrapper captcha-wrapper">
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
                    onChange={handleUserInputChange}
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
        </div>
      </div>
    </>
  );
};
export async function getServerSideProps(context) {
  const id = context.query.id;
  const role = context.query.role;
  try {
    if (id) {
      return {
        props: {
          data: id,
          role: role,
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
