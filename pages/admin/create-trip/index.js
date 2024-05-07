import Header from "@/components/HeaderSection/Header";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { getRoles } from "@/ApiServices/apiService";

const index = () => {
  const [role, setRole] = useState("");
  const router = useRouter();
  const signUpFunction = () => {
    const roleData = role?.data?.find(
      (list) => list?.roleName === "Organizer"
    )._id;

    router.push(
      `/admin/signup?id=${roleData ? roleData : ""}&role="Organizer"`
    );
  };
  const signInfunction = () => {
    router.push("/admin/login?User=false");
  };

  useEffect(() => {
    getRoles(setRole);
  }, []);
  return (
    <>
      <Header />

      <div className="createtrip-section">
        <div className="container-fluid">
          <div className="admin-txt-content">
            <p className="admin-title-txt">نظّم الرحلات واستمتع بالرِّفقة!</p>
            <div className="mt-5 admin-account-box">
              <p>إنشئ حسابك كمنظم رحلات</p>
              <div className="admin-ac-btnbox">
                <button
                  className="btn-active"
                  onClick={() => {
                    signUpFunction();
                  }}
                >
                  إنشاء حساب
                </button>
                <button
                  className="btn-inactive"
                  onClick={() => {
                    signInfunction();
                  }}
                >
                  تسجيل الدخول
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
