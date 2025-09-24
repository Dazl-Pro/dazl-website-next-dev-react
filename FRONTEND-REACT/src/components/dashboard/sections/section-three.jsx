import React from "react";
import ShrinkCard from "../cards/shrinkCard";
import "./sections.css";

const SectionThree = () => {
  const data = [
    {
      title: "real estate pros",
      navigate: "/signup-users/agent",
    },
    {
      title: "service pros",
      navigate: "/signup-users/professional",
    },
    {
      title: "homeowners",
      navigate: "/signup-users/customer",
    },
  ];
  return (
    <div className="bg-white py-5">
      <div className="container">
        <div className="row">
          {data.map((items, index) => {
            return (
              <div className="col-md-4 mb-4 mb-md-0 rounded-4 " key={index}>
                <div className="col-innerr h-100 shadow cards-dazll-coll rounded-4 position-relative">
                  <ShrinkCard
                    title={items.title}
                    index={index}
                    navigate={items.navigate}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SectionThree;
