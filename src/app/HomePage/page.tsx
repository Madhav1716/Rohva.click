"use client";
import {
  Camera,
  Star,
  Heart,
  Sparkles,
  Music,
  Clock,
  Feather,
  Moon,
  Sun,
  Diamond,
  Globe,
  MessageCircle as ChatBubble,
  Leaf,
  LucideIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface Firefly {
  top: string;
  left: string;
  duration: string;
  delay: string;
  size: string;
}

interface Ripple {
  x: number;
  y: number;
}

interface FloatingElement {
  icon: LucideIcon;
  color: string;
  size: number;
  top: string;
  left: string;
}

export default function HomePage() {
  const [fireflies, setFireflies] = useState<Firefly[]>([]);
  const router = useRouter();
  const [ripple, setRipple] = useState<Ripple | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const generateFireflies = () =>
      Array.from({ length: 12 }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        duration: `${4 + Math.random() * 5}s`,
        delay: `${Math.random() * 3}s`,
        size: `${Math.random() * 0.7 + 0.5}rem`,
      }));

    setFireflies(generateFireflies());

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x =
        ((e.clientX - rect.left) / containerRef.current.offsetWidth) * 30 - 15;
      const y =
        ((e.clientY - rect.top) / containerRef.current.offsetHeight) * 30 - 15;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingElements: FloatingElement[] = [
    {
      icon: Heart,
      color: "text-vintageRose",
      size: 14,
      top: "10%",
      left: "15%",
    },
    {
      icon: Star,
      color: "text-vintageRose",
      size: 18,
      top: "15%",
      left: "85%",
    },
    {
      icon: Music,
      color: "text-vintageRose",
      size: 16,
      top: "85%",
      left: "10%",
    },
    {
      icon: Clock,
      color: "text-vintageRose",
      size: 20,
      top: "80%",
      left: "90%",
    },
    {
      icon: Sparkles,
      color: "text-vintageRose",
      size: 16,
      top: "5%",
      left: "50%",
    },
    {
      icon: Camera,
      color: "text-vintageRose",
      size: 18,
      top: "30%",
      left: "20%",
    },
    {
      icon: Feather,
      color: "text-vintageRose",
      size: 14,
      top: "40%",
      left: "70%",
    },
    {
      icon: Moon,
      color: "text-vintageRose",
      size: 22,
      top: "60%",
      left: "30%",
    },
    { icon: Sun, color: "text-vintageRose", size: 20, top: "75%", left: "50%" },
    {
      icon: Diamond,
      color: "text-vintageRose",
      size: 18,
      top: "25%",
      left: "40%",
    },
    {
      icon: Globe,
      color: "text-vintageRose",
      size: 20,
      top: "50%",
      left: "90%",
    },
    {
      icon: ChatBubble,
      color: "text-vintageRose",
      size: 14,
      top: "70%",
      left: "15%",
    },
    {
      icon: Leaf,
      color: "text-vintageRose",
      size: 18,
      top: "85%",
      left: "60%",
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-screen text-brown-900 font-serif bg-vintageBg overflow-hidden">
      <div className="pt-16 w-full">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full bg-repeat"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        {/* Buy me a Pizza button in top left corner */}
        <motion.div
          className="fixed top-4 left-4 z-50"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}>
          <a href="https://www.buymeacoffee.com/maddy.17" target="_blank" rel="noopener noreferrer">
            <img 
              src="https://img.buymeacoffee.com/button-api/?text=Buy me a Pizza&emoji=🍕&slug=maddy.17&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"
              alt="Buy me a Pizza"
              className="hover:opacity-90 transition-opacity"
            />
          </a>
        </motion.div>

        {/* Floating elements with subtle movement */}
        {floatingElements.map((item, index) => (
          <motion.div
            key={index}
            className={`absolute ${item.color} transition-transform`}
            style={{
              top: item.top,
              left: item.left,
            }}
            animate={{
              x: [0, 10, 0, -10, 0],
              y: [0, -10, 0, 10, 0],
              rotate: [0, 10, 0, -10, 0],
            }}
            transition={{
              duration: 5 + index,
              ease: "easeInOut",
              repeat: Infinity,
            }}>
            <item.icon size={item.size} />
          </motion.div>
        ))}

        {/* Fireflies */}
        {fireflies.map((firefly, i) => (
          <motion.div
            key={i}
            className="absolute bg-vintageGold rounded-full opacity-70"
            style={{
              top: firefly.top,
              left: firefly.left,
              width: firefly.size,
              height: firefly.size,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: parseFloat(firefly.duration),
              delay: parseFloat(firefly.delay),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Main Card */}
        <motion.div
          className="relative w-full max-w-md p-8 mx-auto rounded-lg text-center bg-vintagePaper backdrop-blur-lg shadow-lg border border-brown-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            transform: `perspective(1000px) rotateX(${
              mousePosition.y * 0.05
            }deg) rotateY(${mousePosition.x * 0.05}deg)`,
          }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            <h1 className="text-4xl font-bold mb-2 text-vintageRose">Rohva</h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-0.5 bg-vintageGold mx-auto mb-4"
            />

            <p className="text-sm text-vintageRose mb-4 mx-auto">
              Relive classic moments with a timeless touch.
            </p>
            <p className="text-xs text-vintageRose mb-6 mx-auto">
              Step into a world of nostalgia—capture, cherish, and share your
              vintage memories.
            </p>
          </motion.div>

          {/* Camera animation */}
          <motion.div
            className="mb-6 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -5, 5, -5, 0] }}
            transition={{
              scale: { delay: 0.3, duration: 0.5 },
              rotate: { delay: 0.8, duration: 0.5 },
            }}>
            <div className="bg-vintageRose bg-opacity-10 rounded-full">
              <Image
                src="/vercel.png"
                alt="Camera"
                width={90}
                height={90}
                className="text-vintageRose"
              />{" "}
            </div>
          </motion.div>

          {/* Ripple Effect Button */}
          <div
            className="relative inline-block"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setRipple({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              });
              setTimeout(() => setRipple(null), 600);
              router.push("/photo-booth/");
            }}>
            {ripple && (
              <span
                className="absolute bg-vintageRose opacity-40 rounded-full transform scale-0 animate-ripple"
                style={{
                  top: ripple.y,
                  left: ripple.x,
                  width: "150px",
                  height: "150px",
                  marginLeft: "-75px",
                  marginTop: "-75px",
                }}
              />
            )}
            <motion.button
              className="flex items-center justify-center gap-2 bg-brown-50 border border-vintageGold text-vintageRose px-6 py-3 rounded-full text-sm shadow-sm transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <Camera />
              <span>Capture Now</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.p
          className="text-xs text-brown-500 mt-4 text-center w-full max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}>
          {/* No account needed • Instant downloads • Share your vintage style */}
        </motion.p>
      </div>

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
          border-radius: 10px;
        }
        .text-vintageGold {
          color: #c89d68;
        }
        .text-vintageRose {
          color: #b56b75;
        }
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
      <motion.div
        className="fixed bottom-3 right-3 z-40 opacity-60 hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}>
        <div className="text-xs font-serif flex items-center bg-vintagePaper bg-opacity-80 px-2 py-1 rounded-full shadow-sm">
          <span className="text-vintageRose text-opacity-80 tracking-tight text-[10px]"></span>
          <span className="text-vintageRose font-medium text-[10px]">
            Made by Maddy
          </span>
          <Heart size={8} className="text-vintageRose mx-0.5 inline-block" />
        </div>
      </motion.div>
      <motion.section
        className="w-full max-w-4xl mx-auto px-4 mt-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            className="bg-vintagePaper p-6 rounded-lg shadow-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}>
            <Camera size={32} className="text-vintageRose mb-4" />
            <h3 className="text-lg font-semibold text-vintageRose mb-2">
              Preserve Memories
            </h3>
            <p className="text-xs text-vintageRose">
              Transform your digital photos into timeless vintage-style memories
              with our unique photo editing tools.
            </p>
          </motion.div>

          <motion.div
            className="bg-vintagePaper p-6 rounded-lg shadow-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}>
            <Sparkles size={32} className="text-vintageRose mb-4" />
            <h3 className="text-lg font-semibold text-vintageRose mb-2">
              Artistic Filters
            </h3>
            <p className="text-xs text-vintageRose">
              Explore a collection of carefully crafted filters that bring a
              nostalgic and artistic touch to your photographs.
            </p>
          </motion.div>

          <motion.div
            className="bg-vintagePaper p-6 rounded-lg shadow-sm"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}>
            <Globe size={32} className="text-vintageRose mb-4" />
            <h3 className="text-lg font-semibold text-vintageRose mb-2">
              Easy Sharing
            </h3>
            <p className="text-xs text-vintageRose">
              Share your vintage-inspired memories effortlessly with friends and
              family through our simple, intuitive platform. Don&apos;t forget
              to tag #ClickWithRohva.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
