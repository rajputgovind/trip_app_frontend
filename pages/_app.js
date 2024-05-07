import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import { MyContext } from "../MyContext";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import Head from "next/head";
import Mainfooter from "../components/MainFooter/mainFooter";
import { useRouter } from "next/router";
import { getSettingsData, getAllFilterData } from "../ApiServices/apiService";

import Script from "next/script";
export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [addDestination, setDestination] = useState([
    {
      duration: "",
      date: "",
      city: "",
      agenda: "",
      hotelName: "",
      image: 0,
      faceImage: [],
    },
  ]);
  const [settingsData, setSettingsData] = useState();
  const [editProfile, setEditProfile] = useState(false);
  const [editDestination, setEditDestination] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState();
  const [flightInformation, setFlightInformation] = useState({
    country: "",
    date: "",
    duration: "",
    tripIncludes: "",
    price: "",
    email: "",
    name: "",
    phone: "",
    tripName: "",
    groupType: "",
    tripType: "",
    image: "",
    tripLogo: "",
    termsAndConditions: "",
    currency: "",
    logoTripDummy: null,
    mainTripDummy: null,
  });
  const getAllSettingData = () => {
    getSettingsData(setLoading, router, setSettingsData);
  };

  useEffect(() => {
    getAllSettingData();
    getAllFilterData(setFilterData);
  }, [router.pathname]);
  const atOptions = {
    key: "cecfcf639302f20f68a3213810a64f2e",
    format: "iframe",
    height: 60,
    width: 468,
    params: {},
  };
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "//www.topcreativeformat.com/cecfcf639302f20f68a3213810a64f2e/invoke.js";
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);

    window.atOptions = {
      key: "cecfcf639302f20f68a3213810a64f2e",
      format: "iframe",
      height: 60,
      width: 468,
      params: {},
    };
  }, []);

  return (
    <>
      <Head>
        <title>Trip planning</title>
        <link rel="icon" href="/mainfavicon.png" />
        <meta name="description" content="رحلات جماعية.. لحظات غامرة" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9154877304850745"
          crossorigin="anonymous"
        ></script>

  
      </Head>
      <Script
        src="//pl21730445.toprevenuegate.com/0dd843008e043633d77c86beef925f18/invoke.js"
        async="async"
        data-cfasync="false"
      />
       {/* <Script
          type="text/javascript"
          src="//pl21730419.toprevenuegate.com/b5/ec/fc/b5ecfcdd14a583602436b138590db384.js"
        /> */}
   
      <ToastContainer />

      <MyContext.Provider
        value={{
          flightInformation,
          setFlightInformation,
          addDestination,
          setDestination,
          editDestination,
          setEditDestination,
          editProfile,
          setEditProfile,
        }}
      >
        <Component
          {...pageProps}
          flightInformation={flightInformation}
          setFlightInformation={setFlightInformation}
          addDestination={addDestination}
          setDestination={setDestination}
          editDestination={editDestination}
          setEditDestination={setEditDestination}
          editProfile={editProfile}
          setEditProfile={setEditProfile}
        />

        <div
          id="container-0dd843008e043633d77c86beef925f18"
          // className="add-test"
        ></div>

        <Mainfooter settingData={settingsData} filterData={filterData} />
      </MyContext.Provider>
    </>
  );
}
