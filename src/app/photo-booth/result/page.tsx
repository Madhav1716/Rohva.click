"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ArrowLeft,
  Share2,
  Instagram,
  Facebook,
  Twitter,
  Copy,
  Check,
  Camera,
  Heart,
  Sparkles,
  PenTool,
} from "lucide-react";
import * as domtoimage from "dom-to-image";
import confetti from "canvas-confetti";

export default function PhotoBoothResult() {
  const router = useRouter();
  const [photos, setPhotos] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState("vertical");
  const collageRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loadingEffect, setLoadingEffect] = useState(true);
  const [activeStickers, setActiveStickers] = useState([]);

  // Background colors with labels
  const bgColors = [
    { color: "#ffffff", label: "White" },
    { color: "#000000", label: "Black" },
    { color: "#fce7f3", label: "Pink" },
    { color: "#ede9fe", label: "Purple" },
    { color: "#e0f2fe", label: "Blue" },
    { color: "#ecfccb", label: "Green" },
    { color: "#fef3c7", label: "Yellow" },
    { color: "#f8f1e4", label: "Vintage" },
  ];
  const [bgColor, setBgColor] = useState(bgColors[0].color);

  // Layouts
  const layouts = [
    { id: "vertical", label: "Vertical" },
    { id: "horizontal", label: "Horizontal" },
    { id: "grid", label: "Grid" },
    { id: "polaroid", label: "Polaroid" },
  ];

  // Filters
  const filters = [
    { id: "", label: "None" },
    { id: "filter-grayscale", label: "Grayscale" },
    { id: "filter-sepia", label: "Sepia" },
    { id: "filter-vintage", label: "Vintage" },
    { id: "filter-contrast", label: "Contrast" },
    { id: "filter-blur", label: "Soft Focus" },
  ];

  // Stickers
  const stickers = [
    { id: "heart", icon: <Heart size={24} />, color: "#ff6b6b" },
    { id: "star", icon: <Sparkles size={24} />, color: "#ffd43b" },
    { id: "camera", icon: <Camera size={24} />, color: "#4dabf7" },
    { id: "draw", icon: <PenTool size={24} />, color: "#38d9a9" },
  ];

  // Handle sticker drag

  // Simulated loading effect
  useEffect(() => {
    setTimeout(() => {
      setLoadingEffect(false);

      // Trigger confetti when loading is complete
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1500);
  }, []);

  useEffect(() => {
    const savedPhotos = localStorage.getItem("photos");
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

  // Download the complete collage using domtoimage
  const handleDownload = async () => {
    if (!collageRef.current || photos.length === 0) {
      alert("No photos to download.");
      return;
    }

    setIsDownloading(true);

    try {
      // Wait for all images to load
      await Promise.all(
        Array.from(collageRef.current.querySelectorAll("img")).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.onload = resolve;
                img.onerror = resolve;
              })
        )
      );

      // Create a high-quality JPEG from the collage element
      const dataUrl = await domtoimage.toJpeg(collageRef.current, {
        quality: 0.95,
        bgcolor: bgColor,
        height: collageRef.current.offsetHeight,
        width: collageRef.current.offsetWidth,
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          width: `${collageRef.current.offsetWidth}px`,
          height: `${collageRef.current.offsetHeight}px`,
        },
      });

      // Create a download link
      const link = document.createElement("a");
      link.download = `vintage-photobooth-${new Date()
        .toISOString()
        .slice(0, 10)}.jpg`;
      link.href = dataUrl;
      link.click();

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (error) {
      console.error("Error creating or downloading collage:", error);
      alert("Failed to download the collage. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!collageRef.current) return;

    try {
      const dataUrl = await domtoimage.toJpeg(collageRef.current, {
        quality: 0.8,
        bgcolor: bgColor,
      });

      // Create a temporary canvas to convert data URL to blob
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Convert canvas to blob and copy to clipboard
      canvas.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  // Render sticker
  const renderSticker = (sticker) => {
    switch (sticker.type) {
      case "heart":
        return <Heart size={36} color={sticker.color} />;
      case "star":
        return <Sparkles size={36} color={sticker.color} />;
      case "camera":
        return <Camera size={36} color={sticker.color} />;
      case "draw":
        return <PenTool size={36} color={sticker.color} />;
      default:
        return null;
    }
  };

  // Render the collage based on selected layout
  const renderCollage = () => {
    if (photos.length === 0) {
      return (
        <div className="text-center text-gray-500">No photos selected.</div>
      );
    }

    switch (selectedLayout) {
      case "horizontal":
        return (
          <div className="flex flex-row gap-2 font-serif relative">
            {photos.map((photo, index) => (
              <div key={index} className="flex-1">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className={`w-full object-cover  ${selectedFilter}`}
                  crossOrigin="anonymous"
                />
              </div>
            ))}
          </div>
        );
      case "grid":
        return (
          <div className="grid grid-cols-2 gap-2 font-serif text-vintageRose relative">
            {photos.map((photo, index) => (
              <div key={index} className={index === 2 ? "col-span-2" : ""}>
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className={`w-full object-cover rounded-md ${selectedFilter}`}
                  crossOrigin="anonymous"
                />
              </div>
            ))}
          </div>
        );
      case "polaroid":
        return (
          <div className="flex flex-col items-center gap-4 relative">
            {photos.map((photo, index) => (
              <div
                key={index}
                className="bg-white p-2 pb-8 shadow-md rotate-2 hover:rotate-0 transition-all duration-300">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className={`w-64 h-48 object-cover ${selectedFilter}`}
                  crossOrigin="anonymous"
                />
              </div>
            ))}
          </div>
        );
      default: // vertical layout
        return (
          <div className="flex flex-col gap-2 text-vintageRose relative">
            {photos.map((photo, index) => (
              <div key={index}>
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className={`w-full object-cover ${selectedFilter}`}
                  crossOrigin="anonymous"
                />
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-serif items-center justify-center text-vintageRose bg-vintageBg p-4 md:p-6">
      <AnimatePresence>
        {loadingEffect && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-vintageBg z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <motion.div
              className="flex flex-col items-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 1] }}
              transition={{ duration: 1 }}>
              <Camera size={60} className="text-vintageRose mb-4" />
              <motion.div
                className="h-1 bg-vintageGold rounded-full w-48"
                initial={{ width: 0 }}
                animate={{ width: 192 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
              <p className="mt-4 text-lg text-vintageRose font-medium">
                Creating your masterpiece...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="flex flex-col md:flex-row gap-8 w-full max-w-4xl bg-vintagePaper p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}>
        {/* Left Side - Photo Collage */}
        <motion.div
          ref={collageRef}
          className="flex-1 p-4 rounded-lg overflow-hidden shadow-md transition-all duration-300 min-h-64 relative"
          style={{ backgroundColor: bgColor }}
          whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
          {renderCollage()}

          {/* Active Stickers */}
          {activeStickers.map((sticker) => (
            <motion.div
              key={sticker.id}
              className="absolute cursor-move"
              drag
              dragMomentum={false}
              onDragEnd={(event, info) =>
                handleDragEnd(event, info, sticker.id)
              }
              style={{
                left: sticker.position.x,
                top: sticker.position.y,
                rotate: sticker.rotation,
                scale: sticker.scale,
                zIndex: 10,
              }}
              whileHover={{ scale: sticker.scale * 1.1 }}>
              <div className="relative">
                {renderSticker(sticker)}
                <button
                  onClick={() => removeSticker(sticker.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  ×
                </button>
              </div>
            </motion.div>
          ))}

          {/* Branding & Bottom Spacing */}
          <motion.div
            className="flex flex-col items-center justify-center mt-6 py-4 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}>
            <span className="text-lg font-bold tracking-wide text-[#b56b75] flex items-center gap-2">
              Vintage Booth
            </span>
            {showDate && (
              <p className="text-sm text-[#b56b75]">
                {new Date().toLocaleDateString()}
              </p>
            )}
          </motion.div>
        </motion.div>

        {/* Right Side - Controls */}
        <div className="flex-1 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}>
            <h2 className="text-xl font-semibold text-gray-600 text-vintageRose font-serif mb-2">
              Your Vintage Creation
            </h2>
            <p className="text-sm text-gray-600 text-vintageRose font-serif mb-4">
              Customize your collage with these options:
            </p>
          </motion.div>

          {/* Layouts */}
          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}>
            <p className="text-sm font-semibold text-vintageRose text-gray-600 mb-2">
              Layout
            </p>
            <div className="flex flex-wrap gap-2">
              {layouts.map((layout) => (
                <motion.button
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className={`px-3 py-2 text-xs rounded-lg transition-all duration-200 ${
                    selectedLayout === layout.id
                      ? "bg-vintageRose text-white font-medium"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  {layout.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}>
              <p className="text-sm font-semibold text-gray-600">Filters</p>
              <motion.span
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}>
                ▼
              </motion.span>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-100">
                    {filters.map((filter) => (
                      <motion.button
                        key={filter.id}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                          selectedFilter === filter.id
                            ? "bg-vintageGold text-white font-medium"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        {filter.label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Stickers */}
          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowStickers(!showStickers)}>
              <p className="text-sm font-semibold text-gray-600">
                Stickers & Charms
              </p>
              <motion.span
                animate={{ rotate: showStickers ? 180 : 0 }}
                transition={{ duration: 0.3 }}>
                ▼
              </motion.span>
            </div>

            <AnimatePresence>
              {showStickers && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-gray-100">
                    {stickers.map((sticker) => (
                      <motion.button
                        key={sticker.id}
                        onClick={() => addSticker(sticker)}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ color: sticker.color }}>
                        {sticker.icon}
                      </motion.button>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Tip: Drag stickers to position them. Click the x to remove.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Background Colors */}
          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}>
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Background
            </p>
            <div className="flex flex-wrap gap-2">
              {bgColors.map((color) => (
                <motion.button
                  key={color.color}
                  onClick={() => setBgColor(color.color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center`}
                  style={{
                    backgroundColor: color.color,
                    borderColor:
                      bgColor === color.color ? "#f43f5e" : "transparent",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={color.label}>
                  {bgColor === color.color && (
                    <Check size={16} className="text-vintageRose" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Date Toggle */}
          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-600">Show Date</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showDate}
                  onChange={() => setShowDate(!showDate)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vintageRose"></div>
              </label>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="mt-4 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}>
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading || photos.length === 0}
              className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                isDownloading || photos.length === 0
                  ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                  : "bg-rose-500 text-white hover:bg-rose-600"
              }`}
              whileHover={{
                scale: photos.length > 0 && !isDownloading ? 1.02 : 1,
              }}
              whileTap={{
                scale: photos.length > 0 && !isDownloading ? 0.98 : 1,
              }}>
              {isDownloading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}>
                    <Download size={18} className="text-white" />
                  </motion.div>
                  <span className="text-white">Processing...</span>
                </div>
              ) : (
                <>
                  <Download size={18} className="text-white" />
                  <span className="text-white">Download Collage</span>
                </>
              )}
            </motion.button>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium bg-amber-500 text-white hover:bg-amber-600 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                <Share2 size={18} className="text-white" />
                <span className="text-white">Share</span>
              </motion.button>

              <motion.button
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>
                {copied ? (
                  <>
                    <Check size={18} className="text-green-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copy</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Share Options */}
            <AnimatePresence>
              {showShareOptions && (
                <motion.div
                  className="flex gap-2 mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}>
                  <motion.button
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium bg-[#E4405F] text-white hover:bg-opacity-90 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    <Instagram size={18} className="text-white" />
                  </motion.button>
                  <motion.button
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium bg-[#1877F2] text-white hover:bg-opacity-90 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    <Facebook size={18} className="text-white" />
                  </motion.button>
                  <motion.button
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium bg-[#1DA1F2] text-white hover:bg-opacity-90 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    <Twitter size={18} className="text-white" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => router.push("/photo-booth")}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200 mt-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              <ArrowLeft size={18} />
              <span>Take More Photos</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-8 text-center text-gray-500 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}>
        <p>Created with ♥ by Vintage Booth</p>
        <p className="mt-1">Share your creations with #VintageBooth</p>
      </motion.div>
    </div>
  );
}
