import React, { useEffect, useState } from "react";
import Image from "next/image";

import Header from "@/components/HeaderSection/Header";
import Dropdown from "react-bootstrap/Dropdown";

import { useRouter } from "next/router";
import axios from "axios";
import Select from "react-select";
import { getAllTrips, getAllOrganizers } from "@/ApiServices/apiService";
import chevronrighticon from "../../public/chevron-right-icon.svg";
import chevronlefticon from "../../public/chevron-left-icon.svg";
import doublearrowleft from "../../public/double-arrow-left.svg";
import doublearrowright from "../../public/double-arrow-right.svg";
import Pagination from "react-js-pagination";
import { Countries } from "../../countries";
import frenchTodayDate from "../../CommonFunctions/ArabicFormat";
import { toast } from "react-toastify";
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
const Index = (data) => {
  const router = useRouter();

  const [selectedTripType, setSelectedTripType] = useState("");
  const [selectedCountryType, setSelectedCountry] = useState("");
  const [selectedGroupType, setSelectedGroupType] = useState("");

  const [groupTypeGot, setGroupType] = useState("");
  const [tripTypeGot, setTripType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [getTrips, setGetTrips] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [totalDocs, setTotalDocs] = useState();
  const [limit, setLimit] = useState();
  const [options, setOptions] = useState([]);
  const [optionsOrganizer, setOptionsOrganizer] = useState([]);
  const [countryTypeData, setCountryTypeData] = useState("");
  const [organizerList, setOrganizer] = useState("");

  useEffect(() => {
    getAllTrips(
      setGetTrips,
      setTotalDocs,
      setLimit,
      setLoading,

      selectedTripType,

      selectedGroupType,
      currentPage,
      router,
      selectedCountryType,
      organizerList
    );
  }, [currentPage]);

  const handleSearchTrip = () => {
    setCurrentPage(1);
    getAllTrips(
      setGetTrips,
      setTotalDocs,
      setLimit,
      setLoading,

      selectedTripType,

      selectedGroupType,
      currentPage,
      router,
      selectedCountryType,
      organizerList
    );
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    let countryData = Countries?.map((country) => {
      return {
        label: country.nameAr,
        value: country?.name,
      };
    });

    setOptions(countryData);
  }, []);
  const divStyle = {
    backgroundImage: `url(${process.env.NEXT_PUBLIC_IMAGES}/public/tripLogoImages/${data?.settingsData?.searchPageBannerImage})`,
  };

  useEffect(() => {
    getAllOrganizers(setLoading, router, setOptionsOrganizer);
  }, []);
  const searchFunction = (tripData, id) => {
    if (tripData === false) {
      toast.error("التسجيل مغلق");
    }
    router.push(`/details-page?id=${id}`);
  };
  return (
    <>
      <div className="section-search">
        <Header />
        <div className="hero-2 " style={divStyle}>
          {isLoading === true ? (
            <div className="loader-box">
              <div className="loader"></div>
            </div>
          ) : (
            ""
          )}
          <div className="hero-container">
            <p className="title">
              {data?.settingsData?.mainContent
                ? data?.settingsData?.mainContent
                : ""}
            </p>
            <div className="price-container">
              <div className="dropdown-container">
                {data?.data?.tripType === true && (
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="light"
                      id="dropdown-basic"
                      // defaultValue={tripType}
                    >
                      {tripTypeGot ? tripTypeGot : "نوع الرحلة "}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedTripType("Tourism");
                          setTripType(" سياحية");
                        }}
                      >
                        سياحية
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedTripType("Hunting");
                          setTripType(" صيد");
                        }}
                      >
                        صيد
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedTripType("Therapeutic");
                          setTripType(" علاجية");
                        }}
                      >
                        علاجية
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedTripType("Training");
                          setTripType("تدريبية");
                        }}
                      >
                        تدريبية
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedTripType("Educational");
                          setTripType("تعليمية");
                        }}
                      >
                        تعليمية
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}

                <div className="search-select">
                  <Select
                    isClearable
                    // value={optionDataOrganizer}
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

                {data?.data?.groupType === true && (
                  <Dropdown>
                    <Dropdown.Toggle variant="light" id="dropdown-basic">
                      {groupTypeGot ? groupTypeGot : " الفئة"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedGroupType("Men");
                          setGroupType("رجال");
                        }}
                      >
                        رجال
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedGroupType("Women");
                          setGroupType("سيدات");
                        }}
                      >
                        سيدات
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedGroupType("Families");
                          setGroupType("عائلات");
                        }}
                      >
                        عائلات
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedGroupType("Students");
                          setGroupType("طلاب");
                        }}
                      >
                        طلاب
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
                {data?.data && data?.data?.country === true && (
                  <div className="search-select">
                    <Select
                      isClearable
                      name="country"
                      placeholder="الدولة"
                      styles={MultiSelectcustomStyles}
                      options={options}
                      onChange={(e) => {
                        if (e) {
                          setSelectedCountry(e?.value);
                          setCountryTypeData(e?.label);
                        } else {
                          setSelectedCountry("");
                          setCountryTypeData("");
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="search-btn mt-5 d-flex justify-content-center">
                <button onClick={handleSearchTrip}>البحث</button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="card-container ">
            <div className="row">
              {getTrips?.map((trip) => {
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
                              الفئة:
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
    </>
  );
};

export async function getServerSideProps() {
  try {
    let filterTrips = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/filters/get-all-filters`
    );
    let settingsData = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admins/get-settings`
    );
    return {
      props: {
        data: filterTrips?.data?.data,
        settingsData: settingsData?.data?.data,
      },
    };
  } catch (err) {
    return { props: {} };
  }
}

export default Index;
