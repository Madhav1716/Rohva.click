"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  Heart,
  Image,
  Menu,
  X,
  User,
  Settings,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function VintageNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/", icon: BookOpen },
    { name: "Gallery", href: "/gallery", icon: Image },
    { name: "Capture", href: "/photo-booth", icon: Camera },
    { name: "Favorites", href: "/favorites", icon: Heart },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-serif ${
          scrolled ? "py-2 bg-vintagePaper shadow-md" : "py-4 bg-transparent"
        }`}>
        <div className="container px-4 mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <Link href="/" className="flex items-center gap-2">
              <Camera size={24} className="text-vintageRose" />
              <span className="text-xl font-bold text-vintageRose">Rohva</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}>
                <Link
                  href={item.href}
                  className="flex flex-col items-center group">
                  <item.icon
                    size={18}
                    className="text-vintageRose group-hover:text-vintageGold transition-colors duration-300"
                  />
                  <span className="text-xs mt-1 text-vintageRose group-hover:text-vintageGold transition-colors duration-300">
                    {item.name}
                  </span>
                  <motion.div
                    className="h-0.5 bg-vintageGold w-0 group-hover:w-full mt-1"
                    transition={{ duration: 0.3 }}
                    initial={false}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-vintageRose p-2 rounded-full hover:bg-vintageRose hover:bg-opacity-10 transition-colors duration-300">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 bg-vintagePaper bg-opacity-95 md:hidden flex flex-col pt-24"
          initial={{ opacity: 0, x: "100%" }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: "100%" }}
          transition={{ duration: 0.3 }}>
          <div className="container px-6 mx-auto">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}>
                <Link
                  href={item.href}
                  className="flex items-center py-4 border-b border-vintageGold border-opacity-30"
                  onClick={() => setIsOpen(false)}>
                  <item.icon size={20} className="text-vintageRose mr-4" />
                  <span className="text-lg text-vintageRose">{item.name}</span>
                </Link>
              </motion.div>
            ))}

            {/* Settings Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
              className="mt-6">
              <Link
                href="/settings"
                className="flex items-center py-4"
                onClick={() => setIsOpen(false)}>
                <Settings size={20} className="text-vintageRose mr-4" />
                <span className="text-lg text-vintageRose">Settings</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Custom Styles (matching your existing styles) */}
      <style jsx global>{`
        .bg-vintagePaper {
          background: #fdf8e8;
        }
        .text-vintageGold {
          color: #c89d68;
        }
        .text-vintageRose {
          color: #b56b75;
        }
        .border-vintageGold {
          border-color: #c89d68;
        }
        .hover\:bg-vintageRose:hover {
          background-color: #b56b75;
        }
      `}</style>
    </>
  );
}
