import React from "react";

function EventCard({ onclick, eventImg }) {
  return (
    <button onClick={onclick}>
      <img
        src={`${import.meta.env.VITE_URL}${eventImg.imageUrl}`}
        alt="event"
        className="min-w-[196px] h-auto aspect-square rounded-lg object-cover"
      />
    </button>
  );
}

export default EventCard;
