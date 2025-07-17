import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import { toast } from "sonner";
import axios from "axios";

function Event() {
  const [images, setImages] = useState([]);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  // Fetch existing slider images
  const fetchSliders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/slider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching sliders:", err);
      toast.error("Failed to load slider images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);
  return (
    <div className="flex overflow-x-auto gap-2 p-2 scroll-hide">
      {images.map((image, index) => (
        <EventCard eventImg={image} key={index} />
      ))}
    </div>
  );
}

export default Event;
