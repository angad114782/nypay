import React, { useState, useEffect } from "react";

function Banner({
  images = ["/asset/Property 1=Slider.svg"],
  interval = 4000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt=""
          className={`min-w-full block transition-all duration-[1200ms] ease-out transform ${
            index === currentIndex
              ? "opacity-100 scale-100"
              : "opacity-0 absolute inset-0 scale-105"
          }`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            willChange: "opacity, transform",
          }}
        />
      ))}
    </div>
  );
}

export default Banner;
