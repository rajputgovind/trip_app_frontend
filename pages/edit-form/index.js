import React from "react";
import Index from "./[editForm]";
import axios from "axios";
export default function index(data) {

  return <Index />;
}
export async function getServerSideProps(context) {
  try {
   
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/trips/get-single-trip/${context.query.id}`
    );
    return {
      props: {
        data: data,
      },
    };
  } catch (err) {
    return {
      props: {
        data: "",
      },
    };
  }
}
