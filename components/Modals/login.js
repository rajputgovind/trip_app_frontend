import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import React from "react";

import { loginFunction } from "../../ApiServices/apiService";

export default function login({
  loginconfirmModalShow,
  loginhandleCloseConfirm,
  handleshowSignupModal,
  user,
  setLoading,
  setUser,
  router,
  register1,
  handleSubmit1,
  error1,
  setStateChange,
  stateChange,
  reset2,
  path,profileChange,setProfileChange
}) {
  const handleInputs = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const loginFunctionCalling = () => {
    loginFunction(
      user,
      router,
      setLoading,
      path,
      true,
      loginhandleCloseConfirm,
      profileChange,
      setProfileChange
    );
  };

  return (
    <Modal
      show={loginconfirmModalShow}
      onHide={loginhandleCloseConfirm}
      className="modal-box"
    >
      <div className="modal-title p-3 mb-3 modal-header--sticky">
        <div className="modal-title-txt-2 d-flex ">
          <div className="signup-btn--box mb-0">
            <button
              className="mb-0 text-white text-bold bg-transparent border-0"
              onClick={loginhandleCloseConfirm}
            >
              X
            </button>
          </div>

          <h2>تسجيل الدخول</h2>
        </div>
      </div>

      <div className="">
        <p className="login-from-title-admin ">تسجيل الدخول</p>
        <div className="login-form--subcontainer">
          <Form onSubmit={handleSubmit1(loginFunctionCalling)}>
            <Form.Group className="mb-3">
              <Form.Label>الايميل</Form.Label>
              <Form.Control
                {...register1("email", {
                  onChange: (e) => {
                    handleInputs(e);
                  },
                })}
                type="email"
                placeholder="الايميل"
                name="email"
                value={user.email}
              />
              {error1?.email && (
                <p className="error-msg">{error1?.email?.message}</p>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>كلمة المرور</Form.Label>
              <Form.Control
                {...register1("password", {
                  onChange: (e) => {
                    handleInputs(e);
                  },
                })}
                type="password"
                placeholder="كلمة المرور"
                name="password"
                value={user.password}
              />
              {error1?.password && (
                <p className="error-msg">{error1?.password?.message}</p>
              )}
            </Form.Group>
            <div className="login-form-btnbox gap-2 mt-100">
              <button type="submit">تسجيل الدخول</button>
              <button
                // type="button"
                onClick={() => {
                  setStateChange(!stateChange);
                  handleshowSignupModal();
                  loginhandleCloseConfirm();
                  reset2();
                }}
              >
                إنشاء حساب
              </button>
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
