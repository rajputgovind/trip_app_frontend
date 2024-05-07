import React, { useEffect, useState } from "react";
import Header from "@/components/HeaderSection/Header";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { loginFunction, getRoles } from "../../../ApiServices/apiService";
import cookie from "js-cookie";
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

const index = (data) => {

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation),
  });
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setLoading] = useState(false);

  const handleInputs = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  //login Function calling
  const loginFunctionCalling = () => {

    loginFunction(user, router, setLoading, data?.path);
  };

  const [roles, setRoles] = useState("");
  useEffect(() => {
    let token = cookie.get("token");

    if (token) {
      router.push("/");
    } else {
      getRoles(setRoles);
    }
  }, []);
  const userRouting = () => {
    if (data?.data === "false") {
      const roleData = roles?.data?.find(
        (list) => list?.roleName === "Organizer"
      )._id;
      router.push(
        `/admin/signup?id=${roleData ? roleData : ""}&role="Organizer"`
      );
    } else {
      const roleData = roles?.data?.find(
        (list) => list?.roleName === "User"
      )._id;
      router.push(`/admin/signup?id=${roleData ? roleData : ""}&role="User"`);
    }
  };
  return (
    <>
      <Header />

      <div className="admin-signup-bg">
        {isLoading === true ? (
          <div className="loader-box">
            <div className="loader"></div>
          </div>
        ) : (
          ""
        )}
        <div className="container">
          <div className="login-from-container">
            <p className="login-from-title-admin mb-5">تسجيل الدخول</p>
            <div className="login-form--subcontainer">
              <Form onSubmit={handleSubmit(loginFunctionCalling)}>
                <Form.Group className="mb-3">
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
                    value={user.email}
                  />
                  {errors?.email && (
                    <p className="error-msg">{errors?.email?.message}</p>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
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
                    value={user.password}
                  />
                  {errors?.password && (
                    <p className="error-msg">{errors?.password?.message}</p>
                  )}
                </Form.Group>
                <div className="login-form-btnbox gap-2 mt-100">
                  <button type="submit">تسجيل الدخول</button>
                  <button
                    onClick={() => {
                      userRouting();
                    }}
                    // type="button"
                  >
                    إنشاء حساب
                  </button>
                  <div></div>
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
  const user = context.query.User;

  try {
    if (user) {
      return {
        props: {
          data: user,
          path: context.req.headers.referer,
        },
      };
    } else {
      return {
        props: {
          data: "",
          path: context.req.headers.referer,
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
