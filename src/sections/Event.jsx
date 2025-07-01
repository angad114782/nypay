import React from "react";
import EventCard from "../components/EventCard";

function Event() {
  return (
    <div className="flex overflow-x-auto gap-2 p-2 scroll-hide">
      {[...Array(6)].map((_, index) => (
        <EventCard key={index} eventImg={"event.jpg"}></EventCard>
      ))}
    </div>
  );
}

export default Event;
