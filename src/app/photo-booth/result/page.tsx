"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ArrowLeft,
  Check,
  LayoutList,
  Square,
  Image,
  LucideIcon,
  ChevronDown,
} from "lucide-react";
import * as domtoimage from "dom-to-image";
import confetti from "canvas-confetti";

// Type declarations
interface Photo {
  src: string;
  alt: string;
}

interface Layout {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface Filter {
  id: string;
  label: string;
}

interface AspectRatio {
  id: string;
  label: string;
}

interface ColorOption {
  color: string;
  label: string;
}

interface FontStyle {
  id: string;
  label: string;
  className: string;
}

interface TextColor {
  color: string;
  label: string;
}

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  toggleOpen: () => void;
  children: React.ReactNode;
}

interface ColorPickerProps {
  colors: ColorOption[] | TextColor[];
  selectedColor: string;
  onChange: (color: string) => void;
  isColorDisabled?: (color: string) => boolean;
}

interface OptionButtonProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

// Constants
const BG_COLORS: ColorOption[] = [
  { color: "#ffffff", label: "White" },
  { color: "#000000", label: "Black" },
  { color: "#fce7f3", label: "Pink" },
  { color: "#ede9fe", label: "Purple" },
  { color: "#e0f2fe", label: "Blue" },
  { color: "#ecfccb", label: "Green" },
  { color: "#fef3c7", label: "Yellow" },
  { color: "#f8f1e4", label: "Vintage" },
];

const LAYOUTS: Layout[] = [
  { id: "vertical", label: "Vertical", icon: LayoutList },
  // { id: "horizontal", label: "Horizontal", icon: LayoutGrid },
  // { id: "grid", label: "Grid", icon: Grid },
  { id: "polaroid", label: "Polaroid", icon: Image },
  { id: "masonry", label: "Masonry", icon: Square },
];

const FILTERS: Filter[] = [
  { id: "", label: "None" },
  { id: "filter-grayscale", label: "Grayscale" },
  { id: "filter-sepia", label: "Sepia" },
  { id: "filter-vintage", label: "Vintage" },
  { id: "filter-contrast", label: "Contrast" },
  { id: "filter-blur", label: "Soft Focus" },
];

const ASPECT_RATIOS: AspectRatio[] = [
  { id: "original", label: "Original" },
  { id: "square", label: "Square" },
  { id: "4:3", label: "4:3" },
  { id: "16:9", label: "16:9" },
];

const FONT_STYLES: FontStyle[] = [
  { id: "font-serif", label: "Serif", className: "font-serif" },
  { id: "font-sans", label: "Sans", className: "font-sans" },
  {
    id: "font-handwritten",
    label: "Handwritten",
    className: "font-handwritten",
  },
  { id: "font-mono", label: "Monospace", className: "font-mono" },
];

const TEXT_COLORS: TextColor[] = [
  { color: "#b56b75", label: "Vintage Rose" },
  { color: "#000000", label: "Black" },
  { color: "#ffffff", label: "White" },
  { color: "#4a5568", label: "Gray" },
  { color: "#2d3748", label: "Dark Gray" },
];

// Reusable Components
const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isOpen,
  toggleOpen,
  children,
}) => {
  return (
    <motion.div
      className="bg-white p-3 rounded-lg shadow-sm overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}>
      <button
        className="flex items-center justify-between w-full text-left"
        onClick={toggleOpen}>
        <p className="text-sm font-semibold text-gray-600">{title}</p>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}>
          <ChevronDown size={16} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <div className="pt-2 border-t border-gray-100 mt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onChange,
  isColorDisabled,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => {
        const isDisabled = isColorDisabled
          ? isColorDisabled(color.color)
          : false;
        return (
          <motion.button
            key={color.color}
            onClick={() => !isDisabled && onChange(color.color)}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
              isDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{
              backgroundColor: color.color,
              borderColor:
                selectedColor === color.color ? "#f43f5e" : "transparent",
            }}
            whileHover={{ scale: isDisabled ? 1 : 1.1 }}
            whileTap={{ scale: isDisabled ? 1 : 0.95 }}
            disabled={isDisabled}
            aria-label={`${color.label}${
              isDisabled ? " (not available with current background)" : ""
            }`}
            title={`${color.label}${
              isDisabled ? " (not available with current background)" : ""
            }`}>
            {selectedColor === color.color && (
              <Check size={16} className="text-white" />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

const OptionButton: React.FC<OptionButtonProps> = ({
  isSelected,
  onClick,
  children,
  disabled = false,
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
        isSelected
          ? "bg-vintageGold text-white font-medium"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}>
      {children}
    </motion.button>
  );
};

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
  const collageRef = useRef<HTMLDivElement>(null);

  // State management - grouped for better organization
  // Core photo state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingEffect, setLoadingEffect] = useState(true);

  // UI state
  const [showFilters, setShowFilters] = useState(false);
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);
  const [showTextOptions, setShowTextOptions] = useState(false);

  // Style state
  const [selectedLayout, setSelectedLayout] = useState("vertical");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [bgColor, setBgColor] = useState(BG_COLORS[0].color);
  const [aspectRatio, setAspectRatio] = useState("original");

  // Layout-specific settings
  const [polaroidRotation, setPolaroidRotation] = useState(2);
  const [masonryGap, setMasonryGap] = useState(2);
  const [horizontalBalance, setHorizontalBalance] = useState(true);

  // Text customization state
  const [selectedFont, setSelectedFont] = useState("font-serif");
  const [selectedTextColor, setSelectedTextColor] = useState("#b56b75");
  const [textSize, setTextSize] = useState(14);

  // Function to check if color is too similar to background
  const isColorTooSimilar = (color: string): boolean => {
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    };

    const textRgb = hexToRgb(color);
    const bgRgb = hexToRgb(bgColor);

    if (!textRgb || !bgRgb) return false;

    // Calculate color difference using Euclidean distance
    const rDiff = Math.abs(textRgb.r - bgRgb.r);
    const gDiff = Math.abs(textRgb.g - bgRgb.g);
    const bDiff = Math.abs(textRgb.b - bgRgb.b);

    // If the difference is too small, consider them too similar
    return rDiff + gDiff + bDiff < 50;
  };

  // Function to handle text color change
  const handleTextColorChange = (color: string) => {
    if (!isColorTooSimilar(color)) {
      setSelectedTextColor(color);
    }
  };

  // Effect to update text color if it becomes too similar to background
  useEffect(() => {
    if (isColorTooSimilar(selectedTextColor)) {
      // Find the first available color that's not too similar
      const newColor = TEXT_COLORS.find(
        (color) => !isColorTooSimilar(color.color)
      )?.color;
      if (newColor) {
        setSelectedTextColor(newColor);
      }
    }
  }, [bgColor, selectedTextColor]);

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
    if (typeof window !== "undefined") {
      try {
        const savedPhotos = localStorage.getItem("photos");
        const savedFilter = localStorage.getItem("photoFilter");

        if (savedPhotos) {
          setPhotos(
            JSON.parse(savedPhotos).map((src: string) => ({
              src,
              alt: "Photo",
            }))
          );
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
      const dataUrl = await domtoimage.toJpeg(collageRef.current, {
        quality: 1.0,
        bgcolor: bgColor,
      });

      const link = document.createElement("a");
      link.download = "photo-booth-collage.jpg";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error downloading collage:", error);
      alert("Failed to download collage. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Aspect ratio utilities
  const getAspectRatioClass = (): string => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "4:3":
        return "aspect-[4/3]";
      case "16:9":
        return "aspect-[16/9]";
      default:
        return "aspect-auto";
    }
  };

  // Memoized layout utilities - improves performance
  const masonryColumnCount = useMemo(() => {
    const count = photos.length;
    return count <= 2 ? 1 : count <= 4 ? 2 : 3;
  }, [photos.length]);

  // Layout rendering components
  const renderMasonryLayout = () => {
    if (!photos.length) return null;

    return (
      <div
        className="masonry-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${masonryColumnCount}, 1fr)`,
          gap: `${masonryGap * 4}px`,
          gridAutoRows: "auto",
        }}>
        {photos.map((photo, index) => {
          const isFeature = photos.length > 3 && index === 0;
          const rowSpan = isFeature ? 2 : index % 5 === 3 ? 2 : 1;
          const colSpan = isFeature ? 2 : 1;

          return (
            <motion.div
              key={index}
              className="mb-2 overflow-hidden rounded-lg shadow-sm flex flex-col"
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
              }}
              whileHover={{
                scale: 1.03,
                zIndex: 1,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
              transition={{ duration: 0.3 }}>
              <img
                src={photo.src}
                alt={photo.alt}
                className={`w-full h-full rounded-lg ${
                  rowSpan > 1 ? "object-cover" : getAspectRatioClass()
                } ${selectedFilter}`}
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderPolaroidLayout = () => {
    if (!photos.length) return null;

    return (
      <div className="flex flex-wrap justify-center gap-4 relative">
        {photos.map((photo, index) => {
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
                src={photo.src}
                alt={photo.alt}
                className={`w-64 h-48 ${selectedFilter}`}
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          );
        })}
      </div>
    );
  };

  const renderVerticalLayout = () => {
    if (!photos.length) return null;

    return (
      <div className="flex flex-col gap-2 text-vintageRose relative">
        {photos.map((photo, index) => {
          const isFeature = photos.length >= 3 && index === 0;
          return (
            <motion.div
              key={index}
              className={isFeature ? "mb-1" : ""}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}>
              <img
                src={photo.src}
                alt={photo.alt}
                className={`w-full ${getAspectRatioClass()} ${selectedFilter} rounded-md shadow-sm`}
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          );
        })}
      </div>
    );
  };

  // Main collage renderer
  const renderCollage = () => {
    if (photos.length === 0) {
      return (
        <div className="text-center text-gray-500">No photos selected.</div>
      );
    }

    switch (selectedLayout) {
      // case "horizontal":
      //   return renderHorizontalLayout();
      // case "grid":
      //   return renderGridLayout();
      case "polaroid":
        return renderPolaroidLayout();
      case "masonry":
        return renderMasonryLayout();
      default: // vertical layout
        return renderVerticalLayout();
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
    ]
  );

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
              <span
                className={`text-lg font-bold tracking-wide flex items-center gap-2 ${selectedFont}`}
                style={{
                  color: selectedTextColor,
                  fontSize: `${textSize + 4}px`,
                }}>
                Rohva
              </span>
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

          {/* Layouts Section */}
          <CollapsibleSection
            title="Layout"
            isOpen={showLayoutOptions}
            toggleOpen={() => setShowLayoutOptions(!showLayoutOptions)}>
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="rotation-slider"
                  className="text-sm text-gray-600">
                  Rotation
                </label>
                <input
                  id="rotation-slider"
                  type="range"
                  min="0"
                  max="10"
                  value={polaroidRotation}
                  onChange={(e) =>
                    setPolaroidRotation(parseInt(e.target.value))
                  }
                  className="w-32"
                  aria-label="Adjust rotation angle"
                  title="Adjust rotation angle"
                />
                <span className="text-xs text-gray-500 ml-2">
                  {polaroidRotation}°
                </span>
              </div>
            )}

            {/* Horizontal layout options */}
            {selectedLayout === "horizontal" && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Photo Balance</span>
                <div className="flex gap-2">
                  <OptionButton
                    isSelected={horizontalBalance}
                    onClick={() => setHorizontalBalance(true)}>
                    Equal
                  </OptionButton>
                  <OptionButton
                    isSelected={!horizontalBalance}
                    onClick={() => setHorizontalBalance(false)}>
                    Dynamic
                  </OptionButton>
                </div>
              </div>
            )}

            {/* Masonry layout options */}
            {selectedLayout === "masonry" && (
              <div className="flex items-center justify-between">
                <label htmlFor="gap-slider" className="text-sm text-gray-600">
                  Gap Size
                </label>
                <input
                  id="gap-slider"
                  type="range"
                  min="1"
                  max="4"
                  value={masonryGap}
                  onChange={(e) => setMasonryGap(parseInt(e.target.value))}
                  className="w-32"
                  aria-label="Adjust gap size"
                  title="Adjust gap size"
                />
                <span className="text-xs text-gray-500 ml-2">
                  {masonryGap}x
                </span>
              </div>
            )}

            {/* Aspect ratio options */}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <p className="text-sm text-gray-600 mb-2">Aspect Ratio</p>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <OptionButton
                    key={ratio.id}
                    isSelected={aspectRatio === ratio.id}
                    onClick={() => setAspectRatio(ratio.id)}>
                    {ratio.label}
                  </OptionButton>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Filters Section */}
          <CollapsibleSection
            title="Filters"
            isOpen={showFilters}
            toggleOpen={() => setShowFilters(!showFilters)}>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <OptionButton
                  key={filter.id}
                  isSelected={selectedFilter === filter.id}
                  onClick={() => setSelectedFilter(filter.id)}>
                  {filter.label}
                </OptionButton>
              ))}
            </div>
          </CollapsibleSection>

          {/* Background Colors Section */}
          <motion.div
            className="bg-white p-3 rounded-lg shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}>
            <p className="text-sm font-semibold text-gray-600 mb-2">
              Background
            </p>
            <ColorPicker
              colors={BG_COLORS}
              selectedColor={bgColor}
              onChange={setBgColor}
            />
          </motion.div>

          {/* Text Customization Section */}
          <CollapsibleSection
            title="Text Style"
            isOpen={showTextOptions}
            toggleOpen={() => setShowTextOptions(!showTextOptions)}>
            {/* Font Style */}
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Font Style</p>
              <div className="flex flex-wrap gap-2">
                {FONT_STYLES.map((font) => (
                  <OptionButton
                    key={font.id}
                    isSelected={selectedFont === font.className}
                    onClick={() => setSelectedFont(font.className)}>
                    <span className={font.className}>{font.label}</span>
                  </OptionButton>
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <p className="text-sm text-gray-600 mb-2">Text Color</p>
              <ColorPicker
                colors={TEXT_COLORS}
                selectedColor={selectedTextColor}
                onChange={handleTextColorChange}
                isColorDisabled={isColorTooSimilar}
              />
            </div>

            {/* Text Size */}
            <div className="pt-2 border-t border-gray-100 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Text Size</span>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={textSize}
                  onChange={(e) => setTextSize(parseInt(e.target.value))}
                  className="w-32"
                  aria-label="Adjust text size"
                  title="Adjust text size"
                />
                <span className="text-xs text-gray-500 ml-2">{textSize}px</span>
              </div>
            </div>
          </CollapsibleSection>

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
