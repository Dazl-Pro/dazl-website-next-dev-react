import React from "react";
import SectionOne from "./sections/section-one";
import SectionTwo from "./sections/section-two";
import SectionThree from "./sections/section-three";
import SectionFour from "./sections/section-four";
import SectionFive from "./sections/section-five";

const Home = () => {
  const token = localStorage.getItem("token");
  return (
    <div>
      <SectionOne />
      <SectionTwo />
      {!token && <SectionThree />}
      <SectionFour />
      <SectionFive />
    </div>
  );
};

export default Home;
