import React from "react";

function Button3({ text, onclick }) {
  return (
    <button
      className="text-lg font-bold linear-blue text-white w-full h-[48px] rounded-md t-filter2"
      onClick={onclick}
    >
      {text}
    </button>
  );
}

export default Button3;
