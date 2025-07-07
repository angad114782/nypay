import React, { useRef } from "react";
import EventLogo from "/asset/event.jpg";
import { X, Plus } from "lucide-react";

const SuperAdminBannerSlider = () => {
  const fileInputRef = useRef(null);

  const handleAddImages = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    // Logic to handle selected images
    const files = e.target.files;
    if (files && files.length > 0) {
      console.log("Selected files:", files);
      // Add your upload logic here
    }
  };

  const images = [
    { id: 1, url: EventLogo, name: "Image 1" },
    { id: 2, url: EventLogo, name: "Image 2" },
    { id: 3, url: EventLogo, name: "Image 3" },
    { id: 4, url: EventLogo, name: "Image 4" },
    { id: 5, url: EventLogo, name: "Image 5" },
    { id: 6, url: EventLogo, name: "Image 6" },
    { id: 7, url: EventLogo, name: "Image 7" },
    { id: 8, url: EventLogo, name: "Image 8" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Slider Management</h1>
      <p className="text-gray-600 mb-6">
        Manage your slider images here. You can add, delete, and view images.
      </p>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleAddImages}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Images
        </button>
        <div>Delete all images</div>
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <ImageList
        images={images}
        onDelete={(id) => console.log(`Delete image with id: ${id}`)}
        onAddImage={handleAddImages}
      />
    </div>
  );
};

export default SuperAdminBannerSlider;

const ImageList = ({ images, onDelete, onAddImage }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {images.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image.url}
            alt={image.name}
            className="w-full h-auto rounded-lg"
          />
          <button
            onClick={() => onDelete(image.id)}
            className="absolute top-1 right-1 text-white"
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
