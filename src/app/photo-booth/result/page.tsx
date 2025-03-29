"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ArrowLeft,
  Check,
  LayoutGrid,
  LayoutList,
  Square,
  Grid,
  Image,
} from "lucide-react";
import * as domtoimage from "dom-to-image";
import confetti from "canvas-confetti";

// Constants moved outside component to prevent recreation on each render
const BG_COLORS = [
  { color: "#ffffff", label: "White" },
  { color: "#000000", label: "Black" },
  { color: "#fce7f3", label: "Pink" },
  { color: "#ede9fe", label: "Purple" },
  { color: "#e0f2fe", label: "Blue" },
  { color: "#ecfccb", label: "Green" },
  { color: "#fef3c7", label: "Yellow" },
  { color: "#f8f1e4", label: "Vintage" },
];

const LAYOUTS = [
  { id: "vertical", label: "Vertical", icon: LayoutList },
  { id: "horizontal", label: "Horizontal", icon: LayoutGrid },
  { id: "grid", label: "Grid", icon: Grid },
  { id: "polaroid", label: "Polaroid", icon: Image },
  { id: "masonry", label: "Masonry", icon: Square },
];

const FILTERS = [
  { id: "", label: "None" },
  { id: "filter-grayscale", label: "Grayscale" },
  { id: "filter-sepia", label: "Sepia" },
  { id: "filter-vintage", label: "Vintage" },
  { id: "filter-contrast", label: "Contrast" },
  { id: "filter-blur", label: "Soft Focus" },
];

const ASPECT_RATIOS = [
  { id: "original", label: "Original" },
  { id: "square", label: "Square" },
  { id: "4:3", label: "4:3" },
  { id: "16:9", label: "16:9" },
];

// Utility function for triggering confetti
const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

export default function PhotoBoothResult() {
  const router = useRouter();
  const collageRef = useRef(null);

  // State management
  const [photos, setPhotos] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState("vertical");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [bgColor, setBgColor] = useState(BG_COLORS[0].color);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingEffect, setLoadingEffect] = useState(true);
  const [aspectRatio, setAspectRatio] = useState("original");
  const [polaroidRotation, setPolaroidRotation] = useState(2);
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);

  // New state for masonry and horizontal layouts
  const [masonryGap, setMasonryGap] = useState(2);
  const [horizontalBalance, setHorizontalBalance] = useState(true);

  // Loading effect and initial confetti
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingEffect(false);
      triggerConfetti();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Load saved photos and filter from localStorage
  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    if (typeof window !== "undefined") {
      try {
        const savedPhotos = localStorage.getItem("photos");
        // Fixed the key to match what's used in PhotoBooth.js
        const savedFilter = localStorage.getItem("photoFilter");

        if (savedPhotos) {
          setPhotos(JSON.parse(savedPhotos));
        }

        if (savedFilter) {
          setSelectedFilter(savedFilter);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
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
      link.download = `rohva-photobooth-${new Date()
        .toISOString()
        .slice(0, 10)}.jpg`;
      link.href = dataUrl;
      link.click();

      triggerConfetti();
    } catch (error) {
      console.error("Error creating or downloading collage:", error);
      alert("Failed to download the collage. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Get aspect ratio class based on selection
  const getAspectRatioClass = () => {
    return aspectRatio === "original"
      ? "w-full"
      : aspectRatio === "square"
      ? "aspect-square object-cover w-full"
      : aspectRatio === "4:3"
      ? "aspect-[4/3] object-cover w-full"
      : aspectRatio === "16:9"
      ? "aspect-[16/9] object-cover w-full"
      : "w-full";
  };

  // Improved helper function to get dynamic sizes for horizontal layout
  const getHorizontalSizes = () => {
    const count = photos.length;

    if (count <= 1) return [{ flex: "1" }];

    if (horizontalBalance) {
      // Equal distribution
      return photos.map(() => ({ flex: "1" }));
    } else {
      // Dynamic sizing based on photo count and position
      if (count === 2) {
        return [{ flex: "3" }, { flex: "2" }];
      } else if (count === 3) {
        return [{ flex: "2" }, { flex: "1" }, { flex: "2" }];
      } else if (count === 4) {
        return [{ flex: "2" }, { flex: "1" }, { flex: "1" }, { flex: "2" }];
      } else if (count === 5) {
        return [
          { flex: "2" },
          { flex: "1" },
          { flex: "1.5" },
          { flex: "1" },
          { flex: "2" },
        ];
      } else if (count >= 6) {
        // For 6 or more photos, create a pattern of sizes
        return photos.map((_, idx) => {
          if (idx % 3 === 0) return { flex: "2" }; // Feature photo
          if (idx % 3 === 1) return { flex: "1" }; // Smaller photo
          return { flex: "1.5" }; // Medium photo
        });
      }
    }
    return photos.map(() => ({ flex: "1" }));
  };

  // Improved helper function to determine masonry column count based on photo count
  const getMasonryColumnCount = () => {
    const count = photos.length;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    return 3;
  };

  // Get optimal grid layout based on photo count
  const getGridLayout = () => {
    const count = photos.length;

    // Default layout data structure: rows with photo indices
    const layouts = {
      1: [[0]],
      2: [[0, 1]],
      3: [[0], [1, 2]],
      4: [
        [0, 1],
        [2, 3],
      ],
      5: [
        [0, 1],
        [2, 3, 4],
      ],
      6: [
        [0, 1, 2],
        [3, 4, 5],
      ],
    };

    // Return layout or fallback for higher counts
    return layouts[count] || generateDynamicGridLayout(count);
  };

  // Generate a dynamic layout for larger numbers of photos
  const generateDynamicGridLayout = (count) => {
    const rows = [];
    let currentRow = [];

    for (let i = 0; i < count; i++) {
      currentRow.push(i);

      // Create rows with varying numbers of photos (2-3 per row)
      if (currentRow.length === (i % 2 === 0 ? 3 : 2) || i === count - 1) {
        rows.push([...currentRow]);
        currentRow = [];
      }
    }

    return rows;
  };

  // Memoized collage renderer with improved layouts
  const renderCollage = () => {
    if (photos.length === 0) {
      return (
        <div className="text-center text-gray-500">No photos selected.</div>
      );
    }

    // Common image props to avoid repetition
    const imageProps = {
      className: `object-cover ${selectedFilter}`,
      crossOrigin: "anonymous",
    };

    const horizontalSizes = getHorizontalSizes();

    switch (selectedLayout) {
      case "horizontal":
        return (
          <div className="flex flex-col sm:flex-row gap-2 font-serif relative">
            {photos.map((photo, index) => {
              const size = horizontalSizes[index] || { flex: "1" };
              return (
                <motion.div
                  key={index}
                  className="flex-1 min-w-0 overflow-hidden rounded-md"
                  style={{ flex: size.flex }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}>
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    {...imageProps}
                    className={`${getAspectRatioClass(photo, index)} ${
                      imageProps.className
                    } rounded-md shadow-sm`}
                  />
                </motion.div>
              );
            })}
          </div>
        );
      case "grid":
        const gridLayout = getGridLayout();
        return (
          <div className="grid gap-3 font-serif text-vintageRose relative">
            {gridLayout.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex gap-3">
                {row.map((photoIndex) => {
                  // Calculate flex values to make some photos larger based on position
                  const isFeature = row.length < 3 && photoIndex === 0;
                  const flexValue = isFeature ? "2" : "1";

                  return (
                    <motion.div
                      key={photoIndex}
                      className="overflow-hidden rounded-md shadow-sm"
                      style={{ flex: flexValue }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}>
                      <img
                        src={photos[photoIndex]}
                        alt={`Photo ${photoIndex + 1}`}
                        {...imageProps}
                        className={`w-full rounded-md ${getAspectRatioClass(
                          photos[photoIndex],
                          photoIndex
                        )} ${imageProps.className}`}
                      />
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      case "polaroid":
        return (
          <div className="flex flex-wrap justify-center gap-4 relative">
            {photos.map((photo, index) => {
              // Calculate different rotation angles based on position
              const rotationAngle = ((index % 3) - 1) * polaroidRotation;

              return (
                <motion.div
                  key={index}
                  className="bg-white p-2 pb-8 shadow-md transition-all duration-300"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    zIndex: photos.length - index,
                    margin: index % 2 === 0 ? "0 -5px" : "10px 0",
                  }}
                  whileHover={{
                    scale: 1.05,
                    zIndex: photos.length + 1,
                    rotate: 0,
                  }}
                  transition={{ duration: 0.3 }}>
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    {...imageProps}
                    className={`w-64 h-48 ${imageProps.className}`}
                  />
                  {showDate && (
                    <div className="text-center mt-2 font-handwritten text-gray-600">
                      {new Date().toLocaleDateString()}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        );
      case "masonry":
        const columnCount = getMasonryColumnCount();
        return (
          <div
            className="masonry-grid"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
              gap: `${masonryGap * 4}px`,
              gridAutoRows: "auto",
            }}>
            {photos.map((photo, index) => {
              // Create visual interest with varied heights and spans
              const isFeature = photos.length > 3 && index === 0;
              const colSpan = isFeature && columnCount > 1 ? 2 : 1;
              const rowSpan = isFeature ? 2 : index % 5 === 3 ? 2 : 1;

              return (
                <motion.div
                  key={index}
                  className="mb-2 overflow-hidden rounded-lg shadow-sm"
                  style={{
                    gridColumn: isFeature ? "span 2" : "auto",
                    gridRow: `span ${rowSpan}`,
                  }}
                  whileHover={{
                    scale: 1.03,
                    zIndex: 1,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  }}
                  transition={{ duration: 0.3 }}>
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    {...imageProps}
                    className={`w-full h-full rounded-lg ${
                      rowSpan > 1
                        ? "object-cover"
                        : getAspectRatioClass(photo, index)
                    } ${imageProps.className}`}
                  />
                </motion.div>
              );
            })}
          </div>
        );
      default: // vertical layout
        return (
          <div className="flex flex-col gap-2 text-vintageRose relative">
            {photos.map((photo, index) => {
              // Make first photo larger in vertical layout with 3+ photos
              const isFeature = photos.length >= 3 && index === 0;

              return (
                <motion.div
                  key={index}
                  className={isFeature ? "mb-1" : ""}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}>
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    {...imageProps}
                    className={`w-full ${getAspectRatioClass(photo, index)} ${
                      imageProps.className
                    } rounded-md shadow-sm`}
                  />
                </motion.div>
              );
            })}
          </div>
        );
    }
  };

  // Memoize the collage to prevent unnecessary re-renders
  const memoizedCollage = useMemo(
    () => renderCollage(),
    [
      photos,
      selectedLayout,
      selectedFilter,
      aspectRatio,
      polaroidRotation,
      masonryGap,
      horizontalBalance,
      showDate,
    ]
  );

  // Memoized button variants to avoid repetition
  const getButtonClass = (isActive, isPrimary = false) => {
    return `px-3 py-${
      isPrimary ? "3" : "2"
    } text-xs rounded-lg transition-all duration-200 ${
      isActive
        ? `bg-${isPrimary ? "rose-500" : "vintageRose"} text-white font-medium`
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;
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
              transition={{ duration: 1 }}></motion.div>
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
          {memoizedCollage}

          {/* Branding & Bottom Spacing */}
          {photos.length > 0 && (
            <motion.div
              className="flex flex-col items-center justify-center mt-6 py-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}>
              <span className="text-lg font-bold tracking-wide text-[#b56b75] flex items-center gap-2">
                Rohva
              </span>
              {showDate && (
                <p className="text-sm text-[#b56b75]">
                  {new Date().toLocaleDateString()}
                </p>
              )}
            </motion.div>
          )}
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
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setShowLayoutOptions(!showLayoutOptions)}>
              <p className="text-sm font-semibold text-vintageRose text-gray-600 mb-2">
                Layout
              </p>
              <motion.span
                animate={{ rotate: showLayoutOptions ? 180 : 0 }}
                transition={{ duration: 0.3 }}>
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {showLayoutOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {LAYOUTS.map((layout) => {
                      const IconComponent = layout.icon;
                      return (
                        <motion.button
                          key={layout.id}
                          onClick={() => setSelectedLayout(layout.id)}
                          className={`flex flex-col items-center justify-center p-2 rounded-lg ${
                            selectedLayout === layout.id
                              ? "bg-vintageRose text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}>
                          <IconComponent size={18} className="mb-1" />
                          <span className="text-xs">{layout.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Layout-specific options */}
                  {selectedLayout === "polaroid" && (
                    <div className="pt-2 border-t border-gray-100 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Rotation</span>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={polaroidRotation}
                          onChange={(e) =>
                            setPolaroidRotation(parseInt(e.target.value))
                          }
                          className="w-32"
                        />
                        <span className="text-xs text-gray-500 ml-2">
                          {polaroidRotation}°
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Horizontal layout options */}
                  {selectedLayout === "horizontal" && (
                    <div className="pt-2 border-t border-gray-100 mt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Photo Balance
                        </span>
                        <div className="flex gap-2">
                          <motion.button
                            onClick={() => setHorizontalBalance(true)}
                            className={`px-2 py-1 text-xs rounded-lg ${
                              horizontalBalance
                                ? "bg-vintageGold text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            Equal
                          </motion.button>
                          <motion.button
                            onClick={() => setHorizontalBalance(false)}
                            className={`px-2 py-1 text-xs rounded-lg ${
                              !horizontalBalance
                                ? "bg-vintageGold text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            Dynamic
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Masonry layout options */}
                  {selectedLayout === "masonry" && (
                    <div className="pt-2 border-t border-gray-100 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Gap Size</span>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          value={masonryGap}
                          onChange={(e) =>
                            setMasonryGap(parseInt(e.target.value))
                          }
                          className="w-32"
                        />
                        <span className="text-xs text-gray-500 ml-2">
                          {masonryGap}x
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Aspect ratio options */}
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <p className="text-sm text-gray-600 mb-2">Aspect Ratio</p>
                    <div className="flex flex-wrap gap-2">
                      {ASPECT_RATIOS.map((ratio) => (
                        <motion.button
                          key={ratio.id}
                          onClick={() => setAspectRatio(ratio.id)}
                          className={`px-3 py-1 text-xs rounded-lg ${
                            aspectRatio === ratio.id
                              ? "bg-vintageGold text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}>
                          {ratio.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Filters */}
          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1 }}>
            <button
              className="flex items-center justify-between w-full text-left"
              onClick={() => setShowFilters(!showFilters)}>
              <p className="text-sm font-semibold text-gray-600">Filters</p>
              <motion.span
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.3 }}>
                ▼
              </motion.span>
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}>
                  <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-gray-100">
                    {FILTERS.map((filter) => (
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
              {BG_COLORS.map((color) => (
                <motion.button
                  key={color.color}
                  onClick={() => setBgColor(color.color)}
                  className="w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
                  style={{
                    backgroundColor: color.color,
                    borderColor:
                      bgColor === color.color ? "#f43f5e" : "transparent",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={color.label}
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
        <p>Created with ♥ by Rohva</p>
        <p className="mt-1">Share your creations #Rohva</p>
      </motion.div>
    </div>
  );
}
