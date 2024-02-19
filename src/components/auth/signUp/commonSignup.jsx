import React from "react";
import ShrinkCard from "../../dashboard/cards/shrinkCard";
import "./signupPros.css";

const CommonSignup = () => {
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
    <div className="container py-5">
      <div className="row">
        {data.map((items, index) => {
          return (
            <div className="col-md-4" key={index}>
              <div className="col-inner h-100 shadow rounded-4">
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
  );
};

export default CommonSignup;
