import React from "react";
import { FaDice, FaGamepad, FaRocket, FaPlayCircle } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

function RadialMenu({ onClose }) {
  const wedges = [
    {
      d: "M150,150 L300,150 A150,150 0 0,0 255.6,43.4 Z",
      fill: "var(--theme-black2)",
      label: "Aviator",
      icon: <FaDice />,
      x: 220,
      y: 90,
    },
    {
      d: "M150,150 L255.6,43.4 A150,150 0 0,0 150,0 Z",
      fill: "var(--theme-black)",
      label: "Games",
      icon: <FaGamepad />,
      x: 170,
      y: 30,
    },
    {
      d: "M150,150 L150,0 A150,150 0 0,0 44.4,43.4 Z",
      fill: "var(--theme-black2)",
      label: "Crash",
      icon: <FaRocket />,
      x: 80,
      y: 30,
    },
    {
      d: "M150,150 L44.4,43.4 A150,150 0 0,0 0,150 Z",
      fill: "var(--theme-black)",
      label: "Play",
      icon: <FaPlayCircle />,
      x: 30,
      y: 90,
    },
  ];

  const handleClick = (label) => {
    alert(`You clicked: ${label}`);
  };

  return (
    <div className="w-[300px] h-auto relative z-9">
      <svg width="300" height="150" viewBox="0 0 300 150">
        <defs>
          <mask id="donut-mask">
            <rect width="100%" height="100%" fill="white" />
            <circle cx="150" cy="150" r="40" fill="black" />
          </mask>
        </defs>

        {/* Wedges */}
        {wedges.map((w, i) => (
          <g key={i} onClick={() => handleClick(w.label)} style={{ cursor: "pointer" }}>
            <path d={w.d} fill={w.fill} mask="url(#donut-mask)" />
            <foreignObject x={w.x - 5} y={w.y + 2} width="60" height="60">
              <div className="flex flex-col items-center justify-center text-white text-xs">
                <div className="text-lg">{w.icon}</div>
                <div className="mt-1">{w.label}</div>
              </div>
            </foreignObject>
          </g>
        ))}

        {/* Center Circle for closing */}
        <circle
          cx="150"
          cy="150"
          r="35"
          fill="var(--theme-black4)"
          stroke="var(--theme-grey4)"
          strokeWidth="2"
          onClick={onClose}
          style={{ cursor: "pointer" }}
        />
        <foreignObject x={142} y={125} width={50} height={40}>
          <button className="flex justify-center items-center text-white text-sm font-semibold" onClick={onClose}>
            <RxCross2 />
          </button>
        </foreignObject>
      </svg>
    </div>
  );
}

export default RadialMenu;
