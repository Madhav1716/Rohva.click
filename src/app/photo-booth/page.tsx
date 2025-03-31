"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  RefreshCw,
  CheckCircle,
  Timer,
  Zap,
  Sparkles,
  Sun,
  Moon,
  Award,
  Download,
  Sliders,
} from "lucide-react";
import confetti from "canvas-confetti";
import Image from "next/image";

export default function PhotoBooth() {
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [autoSnap, setAutoSnap] = useState(false);
  const [timerDuration, setTimerDuration] = useState(3);
  const [filter, setFilter] = useState("");
  const photoContainerRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(true);
  const [photoCount, setPhotoCount] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [captureEffect, setCaptureEffect] = useState("confetti");

  const filters = [
    { name: "None", value: "", icon: Sun },
    { name: "Grayscale", value: "filter-grayscale", icon: Moon },
    { name: "Sepia", value: "filter-sepia", icon: Award },
    { name: "Vintage", value: "filter-vintage", icon: Sparkles },
  ];

  const captureEffects = [
    { name: "Confetti", value: "confetti" },
    { name: "Flash", value: "flash" },
    { name: "Shutter", value: "shutter" },
  ];

  // Show a hint initially, hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const applyFilter = (selectedFilter: string) => {
    setFilter(selectedFilter);
  };

  const capturePhoto = useCallback(() => {
    if (photos.length < photoCount && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotos((prevPhotos) => [...prevPhotos, imageSrc]);
      }

      // Trigger selected capture effect
      triggerCaptureEffect();

      if (autoSnap && photos.length < photoCount - 1) {
        setTimeout(() => setCountdown(timerDuration), 1000);
      } else {
        setAutoSnap(false);
      }
    }
  }, [photos, photoCount, autoSnap, timerDuration]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      capturePhoto();
      setCountdown(null);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, capturePhoto]);

  useEffect(() => {
    if (autoSnap && photos.length < photoCount) {
      setCountdown(timerDuration);
    } else if (photos.length >= photoCount) {
      setAutoSnap(false);
    }
  }, [autoSnap, photos, photoCount, timerDuration]);

  const triggerCaptureEffect = () => {
    if (captureEffect === "confetti" && photoContainerRef.current) {
      const rect = photoContainerRef.current.getBoundingClientRect();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
      });
    } else if (captureEffect === "flash" && photoContainerRef.current) {
      const flashElement = document.createElement("div");
      flashElement.className = "absolute inset-0 bg-white z-50";
      flashElement.style.opacity = "0.8";
      photoContainerRef.current.appendChild(flashElement);

      setTimeout(() => {
        if (photoContainerRef.current) {
          photoContainerRef.current.removeChild(flashElement);
        }
      }, 150);
    } else if (captureEffect === "shutter") {
      const audio = new Audio("/shutter-sound.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  const startCountdown = () => {
    if (photos.length < photoCount) {
      setCountdown(timerDuration);
    }
  };

  const startAutoSnap = () => {
    if (photos.length < photoCount) {
      setAutoSnap(true);
      setCountdown(timerDuration);
    }
  };

  const resetPhotos = () => {
    setPhotos([]);
    setAutoSnap(false);
  };

  const handleDone = () => {
    localStorage.setItem("photos", JSON.stringify(photos));
    localStorage.setItem("photoFilter", filter);
    router.push("/photo-booth/result");
  };

  const toggleCamera = () => {
    setFacingMode(facingMode === "user" ? "environment" : "user");
  };

  const downloadPhoto = (index: number) => {
    if (photos[index]) {
      const link = document.createElement("a");
      link.href = photos[index];
      link.download = `photo-booth-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  return (
    <div className="min-h-screen text-brown-900 font-serif bg-vintageBg flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>
      <motion.div
        className="max-w-md mx-auto bg-vintagePaper bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-6 w-full border border-vintageGold border-opacity-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <motion.div
          className="text-2xl font-semibold text-center mb-2 flex items-center justify-center gap-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <Image
            src="/vercel.png"
            alt="Camera"
            width={60}
            height={60}
            className="text-vintageRose"
          />
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="absolute right-6 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}>
            <Sliders size={18} className="text-vintageRose" />
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              className="mb-4 bg-gray-50 rounded-lg p-4 shadow-md border border-vintageGold border-opacity-20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}>
              <h3 className="text-vintageRose font-medium mb-2 text-sm uppercase tracking-wide">
                Settings
              </h3>

              <div className="mb-3">
                <label className="text-gray-600 text-sm block mb-2">
                  Number of Photos (3-6):
                </label>
                <div className="flex gap-2">
                  {[3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      onClick={() => setPhotoCount(num)}
                      className={`flex-1 py-2 rounded-md text-sm transition-all duration-200 ${
                        photoCount === num
                          ? "bg-vintageRose text-white"
                          : "bg-gray- 200 text-gray-700 hover:bg-gray-300"
                      }`}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <button
                  onClick={toggleCamera}
                  className="w-full py-2 rounded-md text-sm bg-vintageGold text-white hover:opacity-90 transition-all flex items-center justify-center gap-2">
                  <RefreshCw size={16} />
                  <span>Switch Camera</span>
                </button>
              </div>

              <div>
                <label className="text-gray-600 text-sm block mb-2">
                  Capture Effect:
                </label>
                <div className="flex gap-2">
                  {captureEffects.map((effect) => (
                    <button
                      key={effect.value}
                      onClick={() => setCaptureEffect(effect.value)}
                      className={`flex-1 py-2 rounded-md text-sm transition-all duration-200 ${
                        captureEffect === effect.value
                          ? "bg-vintageRose text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}>
                      {effect.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            mirrored={facingMode === "user"}
            audio={false}
            videoConstraints={{
              facingMode: facingMode,
            }}
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
                Smile! Take {photoCount} photos to create your vintage collage.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div className="mb-4 text-center flex items-center justify-center gap-2 bg-gray-50 rounded-lg p-2 shadow-sm">
          <Timer size={20} className="text-vintageRose" />
          <label htmlFor="timer-range" className="text-gray-600 text-sm">
            Timer:
          </label>
          <input
            id="timer-range"
            type="range"
            min="3"
            max="10"
            value={timerDuration}
            onChange={(e) => setTimerDuration(parseInt(e.target.value))}
            className="w-24 accent-vintageRose"
            aria-label="Timer duration"
          />
          <span className="text-sm text-vintageRose font-semibold">
            {timerDuration}s
          </span>
        </motion.div>

        <motion.div
          className="flex justify-center gap-2 mb-4 flex-wrap"
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

        <motion.div
          className="bg-gray-50 rounded-lg p-3 shadow-md mb-4 border border-vintageGold border-opacity-20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}>
          <div className="grid grid-cols-3 gap-2">
            {Array(photoCount)
              .fill(null)
              .map((_, index: number) => (
                <motion.div
                  key={index}
                  className={`aspect-square rounded-lg overflow-hidden border ${
                    photos[index] ? "border-vintageRose" : "border-gray-200"
                  } ${
                    photos.length === index
                      ? "ring-2 ring-vintageRose ring-opacity-50"
                      : ""
                  } flex items-center justify-center relative transition-all duration-300 bg-gray-50`}
                  whileHover={{ scale: 1.05 }}>
                  {photos[index] ? (
                    <>
                      <motion.img
                        src={photos[index]}
                        alt={`Photo ${index + 1}`}
                        className={`w-full h-full object-cover ${filter}`}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 opacity-0 hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                        <motion.button
                          onClick={() => downloadPhoto(index)}
                          className="p-1 bg-white rounded-full hover:bg-gray-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}>
                          <Download size={16} className="text-vintageRose" />
                        </motion.button>
                        <motion.button
                          onClick={() => removePhoto(index)}
                          className="p-1 bg-white rounded-full hover:bg-gray-100"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}>
                          <RefreshCw size={16} className="text-vintageRose" />
                        </motion.button>
                      </div>
                    </>
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
          <div className="text-xs text-gray-500 text-center mt-2">
            {photos.length}/{photoCount} photos taken
          </div>
        </motion.div>

        <motion.div
          className="h-1 bg-gray-200 rounded-full overflow-hidden mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}>
          <motion.div
            className="h-full bg-vintageRose"
            initial={{ width: 0 }}
            animate={{ width: `${(photos.length / photoCount) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <motion.div
          className="flex justify-between gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}>
          <motion.button
            onClick={startCountdown}
            disabled={photos.length >= photoCount}
            className={`flex-1 py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              photos.length >= photoCount
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-vintageRose text-white hover:bg-vintageRose hover:shadow-md"
            }`}
            whileHover={photos.length < photoCount ? { scale: 1.03 } : {}}
            whileTap={photos.length < photoCount ? { scale: 0.97 } : {}}>
            <Camera size={18} />
            <span>Snap</span>
          </motion.button>

          <motion.button
            onClick={startAutoSnap}
            disabled={photos.length >= photoCount}
            className={`py-3 px-4 rounded-lg text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              photos.length >= photoCount
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-vintageGold text-white hover:bg-vintageGold hover:shadow-md"
            }`}
            whileHover={photos.length < photoCount ? { scale: 1.03 } : {}}
            whileTap={photos.length < photoCount ? { scale: 0.97 } : {}}>
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
                : "bg-vintageRose text-white hover:bg-blue-600 hover:shadow-md"
            }`}
            whileHover={photos.length >= 3 ? { scale: 1.03 } : {}}
            whileTap={photos.length >= 3 ? { scale: 0.97 } : {}}>
            <CheckCircle size={18} />
            <span>Done</span>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {photos.length >= 3 && photos.length < photoCount && (
            <motion.div
              className="mt-3 text-center text-sm text-vintageRose"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}>
              You have enough photos to finish, but can take up to {photoCount}!
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

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
