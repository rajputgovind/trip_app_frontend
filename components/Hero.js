import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import Dropdown from "react-bootstrap/Dropdown";
import { Countries } from "@/countries";
import Select from "react-select";

import {
  getAllTripsHomePage,
  getAllOrganizers,
} from "../ApiServices/apiService";
import chevronrighticon from "../public/chevron-right-icon.svg";
import chevronlefticon from "../public/chevron-left-icon.svg";
import doublearrowleft from "../public/double-arrow-left.svg";
import doublearrowright from "../public/double-arrow-right.svg";
import Pagination from "react-js-pagination";
import { toast } from "react-toastify";
import frenchTodayDate from "../CommonFunctions/ArabicFormat";
import Image from "next/image";


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
const Hero = ({ tripFilter, settingsData }) => {
  const router = useRouter();
  const [tripType, setTripType] = useState("");
  const [groupType, setGroupType] = useState("");

  const [trip, settrip] = useState("");
  const [type, setType] = useState("");

  const [countryType, setCountryType] = useState("");
  const [options, setOptions] = useState([]);
  const [countryData, setCountryData] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [optionsOrganizer, setOptionsOrganizer] = useState([]);
  const [organizerList, setOrganizer] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocs, setTotalDocs] = useState();
  const [limit, setLimit] = useState();
  const [getTrips, setGetTrips] = useState([]);
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
    getAllOrganizers(setLoading, router, setOptionsOrganizer);
  }, []);

  useEffect(() => {
    getAllTripsHomePage(
      setGetTrips,
      setTotalDocs,
      setLimit,
      setLoading,

      tripType,

      type,
      currentPage,
      router,
      countryData,
      organizerList
    );
  }, [currentPage]);
  const handleSearchTrip = () => {
    setCurrentPage(1);
    getAllTripsHomePage(
      setGetTrips,
      setTotalDocs,
      setLimit,
      setLoading,

      tripType,

      type,
      currentPage,
      router,
      countryData,
      organizerList
    );
  };
  const divStyle = {
    backgroundImage: `url(${process.env.NEXT_PUBLIC_IMAGES}/public/tripLogoImages/${settingsData?.homePageBannerImage})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    height: "100vh",
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const searchFunction = (tripData, id) => {
    if (tripData === false) {
      toast.error("التسجيل مغلق");
    }
    router.push(`/details-page?id=${id}`);
  };
  return (
    <div>
      <div className="hero" style={divStyle}>
        <div className="container">
          <div className="hero-container">
            {isLoading === true ? (
              <div className="loader-box">
                <div className="loader"></div>
              </div>
            ) : (
              ""
            )}

            <p className="title">
              {settingsData?.heading && settingsData?.heading}
            </p>

            <p className="title mt-104">
              {" "}
              {settingsData?.mainContent && settingsData?.mainContent}
            </p>
            <div className="price-container">
              <div className="dropdown-container">
                {tripFilter && tripFilter?.tripType === true && (
                  <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                      {trip ? trip : "نوع الرحلة "}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setTripType("Tourism");
                          settrip("‌سياحية ");
                        }}
                      >
                        ‌سياحية
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setTripType("Hunting");
                          settrip("صيد");
                        }}
                      >
                        صيد
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setTripType("Therapeutic");
                          settrip("علاجية");
                        }}
                      >
                        علاجية
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setTripType("Training");
                          settrip("تدريبية");
                        }}
                      >
                        تدريبية
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setTripType("Educational");
                          settrip("تعليمية");
                        }}
                      >
                        تعليمية
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                {/* new dropdown - organizer name */}
                <div className="search-select">
                  <Select
                    isClearable
                    name="organizer"
                    placeholder="حدد المنظم"
                    styles={MultiSelectcustomStyles}
                    options={optionsOrganizer}
                    onChange={(e) => {
                      if (e) {
                        setOrganizer(e.value);
                      } else {
                        setOrganizer("");
                      }
                    }}
                  />
                </div>
                {tripFilter && tripFilter?.groupType === true && (
                  <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                      {type ? type : "الفئة"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setGroupType("Men");
                          setType("رجال");
                        }}
                      >
                        رجال
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setGroupType("Women");
                          setType("سيدات");
                        }}
                      >
                        سيدات
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setGroupType("Families");
                          setType("عائلات");
                        }}
                      >
                        عائلات
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setGroupType("Students");
                          setType("‌طلاب");
                        }}
                      >
                        ‌طلاب
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}

                {tripFilter && tripFilter?.country === true && (
                  <div className="search-select">
                    <Select
                      name="country"
                      placeholder="الدولة"
                      isClearable
                      styles={MultiSelectcustomStyles}
                      options={options}
                      onChange={(e) => {
                        if (e) {
                          setCountryType(e?.label);
                          setCountryData(e?.value);
                        } else {
                          setCountryType("");
                          setCountryData("");
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="search-btn mt-lg-5 d-flex justify-content-center">
                <button onClick={handleSearchTrip}>البحث</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg--cards">
        <div className="container">
          <div className="card-container ">
            <div className="row">
              {getTrips?.map((trip, index) => {
                return (
                  <div className="col-lg-4 col-md-6" key={trip?._id}>
                    <div className="relative-card">
                      <div className="search-trip-imgbox">
                        <img
                          className="big-img"
                          src={`${process.env.NEXT_PUBLIC_IMAGES}/public/tripImages/${trip?.mainTripImage}`}
                          alt="img"
                        />
                        <div className="mini-img-box">
                          <img
                            src={
                              trip?.tripLogo
                                ? `${process.env.NEXT_PUBLIC_IMAGES}/public/tripImages/${trip?.tripLogo}`
                                : ""
                            }
                          />
                        </div>
                      </div>

                      <div className="card-txt-container">
                        <div className="p-3-cards">
                          <p className="p-txt-cards">{trip?.tripName}</p>
                          <div className="sub-txt">
                            <p>
                              {" "}
                              <span className="number--days">
                                {trip?.tripDuration}
                              </span>{" "}
                              : ليلة / ليالي‌
                            </p>
                            <p>
                              الفئة:{" "}
                              {trip?.groupType === "Male"
                                ? "ذكر"
                                : trip?.groupType === "Female"
                                ? "أنثى"
                                : "عائلات"}
                            </p>
                          </div>
                          {/* organizer Name */}
                          <p>
                            منظم الرحلة‌ :
                            {trip?.user?.marketing ? trip?.user?.marketing : ""}
                          </p>
                          <p>
                            تاريخ الرحلة:
                            {trip?.tripDate
                              ? frenchTodayDate(trip?.tripDate)
                              : ""}
                          </p>
                          <div className="btn-box">
                            {/* <p>{trip?.tripPrice}</p> */}
                            <p>{trip?.tripPrice && trip?.tripPrice}</p>
                            {/* <Link href={`/details-page?id=${trip?._id}`}> */}
                            <button
                              // type="button"
                              onClick={() => {
                                searchFunction(trip?.tripStatus, trip?._id);
                              }}
                            >
                              التفاصيل
                            </button>
                            {/* </Link> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* {getTrips?.length ===index+1&& (
                      <div id="container-0dd843008e043633d77c86beef925f18" className="add-test"></div>
                    )} */}
                  </div>
                );
              })}
              {getTrips?.length === 0 && (
                <span>
                  <h2>لم يتم العثور على رحلة</h2>
                </span>
              )}
            </div>
          </div>
          {totalDocs >= 6 && (
            <div className="pagination-buttons">
              <div className="table-pagination ">
                <span className="text-gray mb-3">
                  عرض {(currentPage - 1) * limit + 1} ل {currentPage * limit}ل{" "}
                  {totalDocs}
                </span>
                <ul className="inline-flex items-center gap-1 ">
                  <li>
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={12}
                      totalItemsCount={totalDocs}
                      pageRangeDisplayed={5}
                      onChange={handlePageChange}
                      nextPageText={
                        <Image unoptimized src={chevronrighticon} alt="hh" />
                      }
                      prevPageText={
                        <Image unoptimized src={chevronlefticon} alt="hh" />
                      }
                      firstPageText={
                        <Image unoptimized src={doublearrowleft} alt="hh" />
                      }
                      lastPageText={
                        <Image unoptimized src={doublearrowright} alt="hh" />
                      }
                      itemClass="page-item"
                      linkClass="page-link"
                      activeClass="pageItemActive"
                      activeLinkClass="pageLinkActive"
                    />
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
