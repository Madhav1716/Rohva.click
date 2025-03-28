"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  RefreshCw,
  CheckCircle,
  Timer,
  Zap,
  Camera as CameraIcon,
  Sparkles,
  Sun,
  Moon,
  Award,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function PhotoBooth() {
  const webcamRef = useRef(null);
  const router = useRouter();
  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [autoSnap, setAutoSnap] = useState(false);
  const [timerDuration, setTimerDuration] = useState(3);
  const [filter, setFilter] = useState("");
  // const [cameraActive, setCameraActive] = useState(true);
  const photoContainerRef = useRef(null);
  const [showHint, setShowHint] = useState(true);

  const filters = [
    { name: "None", value: "", icon: Sun },
    { name: "Grayscale", value: "filter-grayscale", icon: Moon },
    { name: "Sepia", value: "filter-sepia", icon: Award },
    { name: "Vintage", value: "filter-vintage", icon: Sparkles },
  ];

  // Show a hint initially, hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const applyFilter = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  useEffect(() => {
    let timer;
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      capturePhoto();
      setCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (autoSnap && photos.length < 3) {
      setCountdown(timerDuration);
    }
  }, [autoSnap, photos]);

  const capturePhoto = () => {
    if (photos.length < 3 && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhotos([...photos, imageSrc]);

      // Create confetti effect when photo is taken
      if (photoContainerRef.current) {
        const rect = photoContainerRef.current.getBoundingClientRect();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight,
          },
        });
      }

      if (autoSnap && photos.length < 2) {
        setTimeout(() => setCountdown(timerDuration), 1000);
      } else {
        setAutoSnap(false);
      }
    }
  };

  const startCountdown = () => {
    if (photos.length < 3) {
      setCountdown(timerDuration);
    }
  };

  const startAutoSnap = () => {
    if (photos.length < 3) {
      setAutoSnap(true);
      setCountdown(timerDuration);
    }
  };

  const resetPhotos = () => {
    setPhotos([]);
    setAutoSnap(false);
    // setCameraActive(true);
  };

  const handleDone = () => {
    localStorage.setItem("photos", JSON.stringify(photos));
    router.push("/photo-booth/result");
  };

  return (
    <div className="min-h-screen text-brown-900 font-serif bg-vintageBg flex items-center justify-center p-4">
      <motion.div
        className="max-w-md mx-auto bg-vintagePaper bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-6 w-full border border-vintageGold border-opacity-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <motion.div
          className="text-2xl font-semibold text-center mb-4 flex items-center justify-center gap-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <CameraIcon size={28} className="text-vintageRose" />
          <span className="text-vintageRose">Photo Booth</span>
        </motion.div>

        {/* Camera */}
        <motion.div
          className={`relative bg-gray-100 rounded-lg overflow-hidden shadow-md mb-4 ${
            countdown !== null ? "ring-2 ring-vintageRose" : ""
          }`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          ref={photoContainerRef}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className={`w-full aspect-video object-cover rounded-lg ${filter}`}
            mirrored={true}
            audio={false}
          />

          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-50 text-white text-7xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: [0.5, 1.2, 1] }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4 }}>
                {countdown}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showHint && (
              <motion.div
                className="absolute bottom-0 inset-x-0 bg-black bg-opacity-60 text-white text-sm py-2 px-4 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}>
                Smile! Take 3 photos to create your vintage collage.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Timer Selector */}
        <motion.div
          className="mb-4 text-center flex items-center justify-center gap-2 bg-gray-50 rounded-lg p-2 shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}>
          <Timer size={20} className="text-vintageRose" />
          <label className="text-gray-600 text-sm">Timer:</label>
          <input
            type="range"
            min="3"
            max="10"
            value={timerDuration}
            onChange={(e) => setTimerDuration(parseInt(e.target.value))}
            className="w-24 accent-vintageRose"
          />
          <span className="text-sm text-vintageRose font-semibold">
            {timerDuration}s
          </span>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="flex justify-center gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}>
          {filters.map((f) => (
            <motion.button
              key={f.name}
              onClick={() => applyFilter(f.value)}
              className={`px-3 py-2 text-sm rounded-md flex flex-col items-center transition-all duration-200 ${
                filter === f.value
                  ? "bg-vintageRose text-white shadow-md scale-105"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <f.icon size={16} className="mb-1" />
              <span>{f.name}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Preview */}
        <motion.div
          className="bg-gray-50 rounded-lg p-3 shadow-md mb-4 border border-vintageGold border-opacity-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}>
          <div className="grid grid-cols-3 gap-2">
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <motion.div
                  key={index}
                  className={`aspect-square rounded-lg overflow-hidden border ${
                    photos[index] ? "border-vintageRose" : "border-gray-200"
                  } ${
                    photos.length === index
                      ? "ring-2 ring-vintageRose ring-opacity-50"
                      : ""
                  } flex items-center justify-center transition-all duration-300 bg-gray-50`}
                  whileHover={{ scale: 1.05 }}>
                  {photos[index] ? (
                    <motion.img
                      src={photos[index]}
                      alt={`Photo ${index + 1}`}
                      className={`w-full h-full object-cover ${filter}`}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <motion.div
                      className="text-vintageRose opacity-40 text-xl font-light"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}>
                      {index + 1}
                    </motion.div>
                  )}
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex justify-between gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}>
          <motion.button
            onClick={startCountdown}
            disabled={photos.length >= 3}
            className={`flex-1 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              photos.length >= 3
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-vintageRose text-white hover:bg-vintageRose hover:shadow-md"
            }`}
            whileHover={photos.length < 3 ? { scale: 1.03 } : {}}
            whileTap={photos.length < 3 ? { scale: 0.97 } : {}}>
            <Camera size={18} />
            <span>Snap</span>
          </motion.button>

          <motion.button
            onClick={startAutoSnap}
            disabled={photos.length >= 3}
            className={`py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              photos.length >= 3
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-vintageGold text-white hover:bg-vintageGold hover:shadow-md"
            }`}
            whileHover={photos.length < 3 ? { scale: 1.03 } : {}}
            whileTap={photos.length < 3 ? { scale: 0.97 } : {}}>
            <Zap size={18} />
            <span>Auto</span>
          </motion.button>

          <motion.button
            onClick={resetPhotos}
            className="py-3 px-4 rounded-lg text-sm bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all duration-300 flex items-center justify-center"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}>
            <RefreshCw size={18} />
          </motion.button>

          <motion.button
            onClick={handleDone}
            disabled={photos.length < 3}
            className={`flex-1 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              photos.length < 3
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md"
            }`}
            whileHover={photos.length === 3 ? { scale: 1.03 } : {}}
            whileTap={photos.length === 3 ? { scale: 0.97 } : {}}>
            <CheckCircle size={18} />
            <span>Done</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx global>{`
        .bg-vintageBg {
          background-color: #f8f1e4;
          background-image: radial-gradient(#c89d68 0.5px, transparent 0.5px),
            radial-gradient(#c89d68 0.5px, #f8f1e4 0.5px);
          background-size: 20px 20px;
          background-position: 0 0, 10px 10px;
        }
        .bg-vintagePaper {
          background: #fdf8e8;
        }
        .text-vintageGold {
          color: #c89d68;
        }
        .text-vintageRose {
          color: #b56b75;
        }
        .bg-vintageRose {
          background-color: #b56b75;
        }
        .bg-vintageGold {
          background-color: #c89d68;
        }
        .filter-grayscale {
          filter: grayscale(100%);
        }
        .filter-sepia {
          filter: sepia(100%);
        }
        .filter-vintage {
          filter: sepia(30%) saturate(70%) brightness(90%);
        }
      `}</style>
    </div>
  );
}
