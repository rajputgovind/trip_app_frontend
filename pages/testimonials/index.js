import React from "react";

import Header from "@/components/HeaderSection/Header";
import axios from "axios";
import parse from "html-react-parser";
const index = (data) => {
  return (
    <>
      <Header />
      <div>
        <div className="cardscontainer">
          <p className="heading">الشهادات - التوصيات</p>
          <h1 className="text-center subheading mb-5">ما يقوله عملاؤنا</h1>
          <div className="container">
            <div className="card-subcontainer">
              {data?.data?.map((testimonial) => (
                <div key={testimonial.id} className="cards">
                  <div className="round-image">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGES}/public/testimonialImages/${testimonial.image}`}
                      alt={testimonial.name}
                    />
                    {/* <Image src={img} alt="" /> */}
                  </div>
                  <div className="description">{testimonial.description&&parse(testimonial.description)}</div>
                  <p className="name">{testimonial.name}</p>
                  <p className="designation">{testimonial.designation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export async function getServerSideProps() {
  try {
    let testimonial = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/testimonials`
    );

    return {
      props: {
        data: testimonial?.data?.testimonials,
      },
    };
  } catch (err) {
    return { props: {} };
  }
}

export default index;
