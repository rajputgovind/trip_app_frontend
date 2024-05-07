import React, { useEffect } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";

const Mainfooter = ({ settingData, filterData }) => {
  //
  return (
    <div>
      <Head></Head>
      <footer className="custom-footer">
        <Container>
          <Row>
            <Col md={4}>
              <h4>تواصل معنا</h4>
              <div className="social-icons">
                {settingData?.facebookUrl && (
                  <Link
                    href={`${settingData?.facebookUrl}?${settingData?.facebookUrl}:""`}
                    target="_blank"
                    className="social-icon"
                  >
                    <FaFacebook size={30} />
                  </Link>
                )}
                {settingData?.twitterUrl && (
                  <Link
                    href={`${settingData?.twitterUrl}?${settingData?.twitterUrl}:""`}
                    target="_blank"
                    className="social-icon"
                  >
                    <FaTwitter size={30} />
                  </Link>
                )}
                {settingData?.instagramUrl && (
                  <Link
                    href={`${settingData?.instagramUrl}?${settingData?.instagramUrl}:""`}
                    target="_blank"
                    className="social-icon"
                  >
                    <FaInstagram size={30} />
                  </Link>
                )}
                {settingData?.linkedInUrl && (
                  <Link
                    href={`${settingData?.linkedInUrl}?${settingData?.linkedInUrl}:""`}
                    target="_blank"
                    className="social-icon"
                  >
                    <FaLinkedin size={30} />
                  </Link>
                )}
              </div>
            </Col>
            <Col md={4}>
              <h4>الروابط</h4>
              <ul className="footer-links">
                <li>
                  <Link
                    href="/termsCondition"
                    target="_blank"
                    className="text-white"
                  >
                    شروط الخدمة
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-white">
                    سياسة الخصوصية
                  </Link>
                </li>
                {/* <li>
                  <Link href="/testimonials" className="text-white">
                    الشهادات - التوصيات
                  </Link>
                </li> */}
                {filterData?.vision && (
                  <li>
                    <Link href="/vision" className="text-white">
                      رؤية
                    </Link>
                  </li>
                )}
                {filterData?.aboutUs && (
                  <li>
                    <Link href="/about-us" className="text-white">
                      من نحن
                    </Link>
                  </li>
                )}
              </ul>
            </Col>
            <Col md={4}>
              <h4>معلومات الاتصال</h4>
              <p>{settingData?.address}</p>
              <p>
                {settingData?.city ? settingData?.city : ""}
                {settingData?.city && ","}{" "}
                {settingData?.state && settingData?.state}{" "}
                {settingData?.zipCode && settingData?.zipCode}
              </p>
              <p>Email:{settingData?.email ? settingData?.email : ""}</p>
            </Col>
          </Row>
        </Container>
      </footer>
      {/* <div id="container-0dd843008e043633d77c86beef925f18"></div> */}
    </div>
  );
};

export default Mainfooter;
