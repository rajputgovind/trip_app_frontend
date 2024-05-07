import Modal from "react-bootstrap/Modal";
import React, { useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Countries } from "@/countries";
import PhoneInput from "react-phone-input-2";
import { registerFunction } from "../../ApiServices/apiService";
import "react-phone-input-2/lib/bootstrap.css";
import ar from "react-phone-input-2/lang/ar.json";
import { TfiReload } from "react-icons/tfi";
import Link from "next/link";
const MultiSelectcustomStyles = {
  input: (provided, state) => ({
    ...provided,
    color: "#000",
    width: "150px",
  }),
  option: (provided, state) => ({
    ...provided,
    // color: state.isSelected ? "red" : "#000",
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
export default function signup({
  signupconfirmModalShow,
  signuphandleCloseConfirm,
  handleLoginshow,
  router,
  register,
  handleSubmit,
  errors,
  user,
  setUser,
  captchaText,
  setCaptchaText,
  canvasRef,
  userInput,
  setUserInput,
  phone,
  setPhone,
  generateRandomChar,
  generateCaptchaText,
  drawCaptchaOnCanvas,
  initializeCaptcha
}) {
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
              user?.countryCode,
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



  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  };
  return (
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

            <div className="condition-box">
              <div className="mt-3 d-flex align-items-center gap-2">
                <Link href="/termsCondition" className="mb-0 curosr-pointer">
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
    </Modal>
  );
}
