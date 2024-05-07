import React, { useEffect, useState, useContext } from "react";
import { MdKeyboardArrowLeft } from "react-icons/md";
import emptycheck from "../../../public/emptycheck.svg";
import Image from "next/image";
import { toast } from "react-toastify";
import Header from "@/components/HeaderSection/Header";
import { useRouter } from "next/router";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import cookie from "js-cookie";
import { MyContext } from "../../../MyContext";
import {
  updateDestination,
  updateDocuments,
} from "../../../ApiServices/apiService";
import check from "../../../public/doublecheck.svg";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
const index = (data) => {

  const router = useRouter();

  const {
    flightInformation,
    setFlightInformation,
    editDestination,
    setEditDestination,
  } = useContext(MyContext);
  const [isLoading, setLoading] = useState(false);
  const [documentInfo, setDocumentInfo] = useState({
    firstName: data?.data?.data[0]?.document?.firstName,
    lastName: data?.data?.data[0]?.document?.lastName,

    age: data?.data?.data[0]?.document?.age,
    gender: data?.data?.data[0]?.document?.gender,
    healthIssues: data?.data?.data[0]?.document?.healthIssues,
    passport: data?.data?.data[0]?.document?.passport,
    id: data?.data?.data[0]?.document?.id,
    phone: data?.data?.data[0]?.document?.phone,
    email: data?.data?.data[0]?.document?.email,
  });

  const editTrip = () => {
    const token = cookie.get("token");
    if (token) {
      if (
        documentInfo?.firstName ||
        documentInfo?.lastName ||
        documentInfo?.age ||
        documentInfo?.gender ||
        documentInfo?.healthIssues ||
        documentInfo?.passport ||
        documentInfo?.id ||
        documentInfo?.phone ||
        documentInfo?.email
      ) {
        let dataFound = updateDestination(
          token,
          editDestination,
          router,
          flightInformation,

          documentInfo,
          setConfirmModalShow,
          confirmModalShow,
          setLoading,
          data?.data?.data[0]?._id,
          data?.data?.data[0]?.document?._id
        );
      } else {
        toast.error("يرجى التحقق من الوثيقة");
      }
    } else {
      router.push("/admin/login?User=false");
    }
  };
  const [show, setShow] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const handleCloseConfirm = () => setConfirmModalShow(false);
  const handleShowConfirm = () => setConfirmModalShow(true);
  useEffect(() => {
    let token = cookie.get("token");
    const role = cookie.get("role");
    if (token) {
      if (role === "Organizer") {
      } else {
        router.push("/");
      }
    } else {
      router.push("/admin/login?User=false");
    }
  }, []);
  return (
    <>
      <Header />
      {/* <ProfileHeader /> */}
      <div className="trip-info-bg-section">
        <div className="container">
          <div className="breadcrumbs-txt-container pt-5">
            <p className=" cursor-pointer"  onClick={() => {
              router.push(`/admin/edit-info?id=${ data?.data?.data[0]?._id}`);
            }}>إنشاء رحلات</p>
            {isLoading === true ? (
              <div className="loader-box">
                <div className="loader"></div>
              </div>
            ) : (
              ""
            )}
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
              <div className="active-infocheck"></div>
              <p>معلومات المسافر</p>
            </div>
          </div>
          <p className=" travller-info">معلومات المسافر المطلوبة</p>
          <div className="form-checkbox-container mb-5">
            <div className="check-list--container">
              <ul>
                <li>
                  <label className="container-check">
                    <input
                      type="checkbox"
                      name="firstName"
                      checked={documentInfo?.firstName}
                      onChange={(e) => {
                        setDocumentInfo({
                          ...documentInfo,
                          [e.target.name]: !documentInfo?.firstName,
                        });
                      }}
                      disabled
                    />
                    <span className="checkmark">
                      <Image src={emptycheck} alt="" />
                    </span>
                  </label>
                  <p className="txt-test">الاسم الأول</p>
                </li>
                <li>
                  <label className="container-check">
                    <input
                      type="checkbox"
                      name="lastName"
                      checked={documentInfo?.lastName}
                      onChange={(e) => {
                        setDocumentInfo({
                          ...documentInfo,
                          [e.target.name]: !documentInfo?.lastName,
                        });
                      }}
                      disabled
                    />
                    <span className="checkmark">
                      <Image src={emptycheck} alt="" />
                    </span>
                  </label>
                  <p className="txt-test">الاسم الأخير </p>
                </li>
             

                <li>
                  <label className="container-check">
                    <input
                      type="checkbox"
                      name="age"
                      checked={documentInfo?.age}
                      onChange={(e) => {
                        setDocumentInfo({
                          ...documentInfo,
                          [e.target.name]: !documentInfo?.age,
                        });
                      }}
                    />
                    <span className="checkmark">
                      <Image src={emptycheck} alt="" />
                    </span>
                  </label>
                  <p className="txt-test"> عمر </p>
                </li>
                <li>
                  <label className="container-check">
                    <input
                      type="checkbox"
                      name="phone"
                      checked={documentInfo?.phone}
                      onChange={(e) => {
                        setDocumentInfo({
                          ...documentInfo,
                          [e.target.name]: !documentInfo?.phone,
                        });
                      }}
                      disabled
                    />
                    <span className="checkmark">
                      <Image src={emptycheck} alt="" />
                    </span>
                  </label>
                  <p className="txt-test"> هاتف</p>
                </li>
              </ul>

              <ul>
                <li>
                  <label className="container-check">
                    <input
                      type="checkbox"
                      name="gender"
                      checked={documentInfo?.gender}
                      onChange={(e) => {
                        setDocumentInfo({
                          ...documentInfo,
                          [e.target.name]: !documentInfo?.gender,
                        });
                      }}
                    />
                    <span className="checkmark">
                      <Image src={emptycheck} alt="" />
                    </span>
                  </label>
                  <p className="txt-test"> جنس </p>
                </li>

                <li>
                  <label className="container-check">
                    <input
                      type="checkbox"
                      name="healthIssues"
                      checked={documentInfo?.healthIssues}
                      onChange={(e) => {
                        setDocumentInfo({
                          ...documentInfo,
                          [e.target.name]: !documentInfo?.healthIssues,
                        });
                      }}
                    />
                    <span className="checkmark">
                      <Image src={emptycheck} alt="" />
                    </span>
                  </label>
                  <p className="txt-test"> مشاكل صحية</p>
                </li>

                <li>
                  <label className="container-check">
                    <input
                      type="checkbox"
                      name="passport"
                      onChange={(e) => {
                        setDocumentInfo({
                          ...documentInfo,
                          [e.target.name]: !documentInfo?.passport,
                        });
                      }}
                      checked={documentInfo?.passport}
                    />
                    <span className="checkmark">
                      <Image src={emptycheck} alt="" />
                    </span>
                  </label>
                  <p className="txt-test"> ‌طلبات خاصة‌ ‌ </p>
                </li>

                <li>
                  <label className="container-check">
                    <input
                      type="checkbox"
                      name="id"
                      onChange={(e) => {
                        setDocumentInfo({
                          ...documentInfo,
                          [e.target.name]: !documentInfo?.id,
                        });
                      }}
                      checked={documentInfo?.id}
                    />
                    <span className="checkmark">
                      <Image src={emptycheck} alt="" />
                    </span>
                  </label>
                  <p className="txt-test"> بطاقة تعريف </p>
                </li>

                <li>
                  <label className="container-check">
                    <input
                      type="checkbox"
                      name="email"
                      checked={documentInfo?.email}
                      onChange={(e) => {
                        setDocumentInfo({
                          ...documentInfo,
                          [e.target.name]: !documentInfo?.email,
                        });
                      }}
                      disabled
                    />
                    <span className="checkmark">
                      <Image src={emptycheck} alt="" />
                    </span>
                  </label>
                  <p className="txt-test">بريد إلكتروني</p>
                </li>
              </ul>
            </div>
          </div>
          <div className="user-form-btn">
            <button onClick={editTrip}>تحرير الرحلة </button>
          
          </div>
        </div>
      </div>

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
              <span>تم طلب انشاء رحلة بنجاح، شكرًا لاستخدامك Gate 8 </span>
            </h2>
          </div>
          <div className="confirm-img-box d-flex justify-content-center">
            <Image src={check} alt="" />
          </div>
          <div className="modal-btn--1 mb-5">
            <button
              // type="button"
              onClick={() => {
                router.push("/admin/my-trip");
              }}
            >
              تفاصيل رحلتي
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
  // createTrip
};

export default index;
export async function getServerSideProps(context) {
  const id = context.query.id;
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
