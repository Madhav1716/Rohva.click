import { Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ShareButtonsProps {
  title?: string;
}

export default function ShareButtons({ title = "Check out my vintage photo from Rohva!" }: ShareButtonsProps) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareData = {
    title: title,
    text: "Created with Rohva Vintage Photo Booth",
    url: url
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
  };

  const copyToClipboard = async () => {
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        // You could add a toast notification here
      }
    } catch (err) {
      console.error('Failed to copy or share:', err);
      // Fallback to clipboard copy if share fails
      try {
        await navigator.clipboard.writeText(url);
      } catch (clipErr) {
        console.error('Failed to copy:', clipErr);
      }
    }
  };

  return (
    <div className="flex gap-3 items-center justify-center">
      <motion.a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-vintageRose bg-opacity-10 hover:bg-opacity-20 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}>
        <Twitter size={20} className="text-vintageRose" />
      </motion.a>
      
      <motion.a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-vintageRose bg-opacity-10 hover:bg-opacity-20 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}>
        <Facebook size={20} className="text-vintageRose" />
      </motion.a>
      
      <motion.a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full bg-vintageRose bg-opacity-10 hover:bg-opacity-20 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}>
        <Linkedin size={20} className="text-vintageRose" />
      </motion.a>
      
      <motion.button
        onClick={copyToClipboard}
        className="p-2 rounded-full bg-vintageRose bg-opacity-10 hover:bg-opacity-20 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}>
        <Link2 size={20} className="text-vintageRose" />
      </motion.button>
    </div>
  );
} 