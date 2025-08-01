import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

const SliderManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");

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

  // Trigger file picker
  const handleAddImages = () => {
    fileInputRef.current?.click();
  };

  // Upload selected files
  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/slider/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || "Images uploaded");
      fetchSliders();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.warning("You are not authorized to perform this action");
        return;
      }
      console.error("Upload error:", err);
      toast.error("Failed to upload images");
    } finally {
      setLoading(false);
      e.target.value = null;
    }
  };

  // Delete one image
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      // find the one you’re deleting to grab its URL
      const img = images.find((i) => i._id === id);
      await axios.delete(`${import.meta.env.VITE_URL}/api/slider/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Image deleted");
      // remove any others that share the same URL
      setImages((prev) => prev.filter((i) => i.imageUrl !== img.imageUrl));
    } catch (err) {
      if (err.response && err.response.status === 403) {
        toast.warning("You are not authorized to perform this action");
        return;
      }
      toast.error("Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  // Delete all images
  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      await axios.delete(`${import.meta.env.VITE_URL}/api/slider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("All images deleted");
      setImages([]);
    } catch (err) {
      console.error("Delete all error:", err);
      toast.error("Failed to delete all images");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Slider Management</h1>
      <p className="text-gray-600 mb-6">
        Manage your slider images here. You can add, delete, and view images.
      </p>

      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddImages}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Processing..." : "Add Images"}
        </button>
        <ConfirmDialog
          buttonLogo={
            <div className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Delete All Images
            </div>
          }
          title={"Delete all Images"}
          description={"Are you sure you want to delete all the images?."}
          onClick={handleDeleteAll}
        />
      </div>

      <input
        type="file"
        accept="image/*"
        name="images"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <ImageList
        images={images}
        onDelete={handleDelete}
        onAddImage={handleAddImages}
      />
    </div>
  );
};

const ImageList = ({ images, onDelete, onAddImage }) => {
  if (images.length === 0)
    return (
      <div className="text-center text-gray-500 mt-6">
        No images uploaded yet.
      </div>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {images.map((image) => (
        <div key={image._id} className="relative ">
          <img
            src={`${import.meta.env.VITE_URL}${image.imageUrl}`}
            alt={image._id}
            className="w-full h-auto rounded-lg object-contain aspect-square"
          />
          <button
            onClick={() => onDelete(image._id)}
            className="absolute top-1 right-1 text-white bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition"
          >
            <X />
          </button>
        </div>
      ))}
      {/* Add Image Card */}

      <div
        onClick={onAddImage}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer min-h-[150px] hover:bg-gray-100 transition"
      >
        <Plus className="w-8 h-8 text-gray-400" />
        <span className="text-gray-500 text-sm mt-2">Add Image</span>
      </div>
    </div>
  );
};

export default SliderManagement;
