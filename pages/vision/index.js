import Header from "@/components/HeaderSection/Header";
import Mainfooter from "../../components/MainFooter/mainFooter";
import React from "react";
import axios from "axios";
import parse from "html-react-parser";
const index = ({ settingsData }) => {
  return (
    <>
      <div>
        {/* termsAndConditions */}
        <Header />
        <div className="container">
          <h1 className="mt-5 mb-5 text-center">رؤية</h1>

          <div className="terms-box mb-5 m-auto">
            {settingsData?.vision&&parse(settingsData?.vision)}
          </div>
        </div>
      </div>
    </>
  );
};
export async function getServerSideProps() {
  try {
    let settingsData = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admins/get-settings`
    );
    return {
      props: {
        settingsData: settingsData?.data?.data,
      },
    };
  } catch (err) {
    return { props: {} };
  }
}
export default index;
