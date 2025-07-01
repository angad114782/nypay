import React from 'react'

function MenuItem({ icon, label, onClick }) {
  const styledIcon = React.cloneElement(icon, {
    className: "w-[19px] h-[19px]"
  });

  return (
    <button className="flex items-center gap-3 text-white cursor-pointer" onClick={onClick}>
      {styledIcon}
      <span className="text-[15px]">{label}</span>
    </button>
  );
}

export default MenuItem;
