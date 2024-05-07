import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import Header from "@/components/HeaderSection/Header";
import Hero from "@/components/Hero";
import axios from "axios";
const inter = Inter({ subsets: ["latin"] });

export default function Home(data) {
  return (
    <>
      <Head>
        <title>Trip planning</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="رحلات جماعية.. لحظات غامرة" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container-fluid p-0">
        <Header />
        <Hero tripFilter={data?.data} settingsData={data?.settingsData} />
      </div>
    </>
  );
}

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
