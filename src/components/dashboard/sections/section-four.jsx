import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "./sections.css";

const SectionFour = () => {
  const [expand, setExpand] = useState(false);
  return (
    <div className="bg-black decor-cmback-secc">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-md-6 text-white order-last order-md-first mt-4 mt-md-0">
            <div className="col-inner mw-560px text-center text-md-start">
              <h6 className="d-inline-block underline-red text-uppercase">
                <span className="position-relative z-1">on trend</span>
              </h6>
              <h2 className="text-uppercase">
                Retro Colors Make a Comeback: What’s{" "}
                <span className="text-primary">Hot in Decor</span> Right Now
              </h2>
              <p className="mb-0">
                {" "}
                Everything old is new again, and that goes for decorating with
                color. While the last decade in home décor has largely been
                defined by white and varying shades of beige and gray, today’s
                designers are harking back to yesteryear with paint colors,
                furniture and even kitchen appliances. Part art deco, part ‘50s
                suburban and part ‘60s mod, these awesome retro colors are fresh
                and refreshed to fit today’s tastes, say the design experts.{" "}
                {expand && (
                  <>
                    The resurgence of retro color palettes is a nod to the
                    timeless appeal of vintage aesthetics, injecting a sense of
                    nostalgia and warmth into contemporary spaces.{" "}
                  </>
                )}
                <span
                  onClick={() => setExpand((p) => !p)}
                  className="fw-bold text-primary read-more"
                >
                  {!expand ? "| Read more" : "| Read Less"}
                </span>
              </p>
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div className="col-inner decor-cmback-imgg position-relative">
              <LazyLoadImage
                alt="img"
                src="/images/sectionFourimage/01-Blog-Image.jpg"
                className="w-100 rounded-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionFour;
