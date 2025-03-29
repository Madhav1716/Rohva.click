import Image from "next/image";

export default function Collage({ images = [] }) {
  return (
    <div className="w-full max-w-xs mx-auto bg-white p-4 rounded-lg shadow-md overflow-hidden">
      {/* Photo Strip - Matches PhotoBooth Shape */}
      <div className="flex flex-col gap-2">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            className="w-full rounded-lg"
            alt={`photo-${index}`}
          />
        ))}
      </div>

      {/* Footer Section - Same as PhotoBooth */}
      <div className="text-center text-gray-500 text-xs mt-2 py-2">
        <span className="font-bold">photobooth</span>
        <span className="block">{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );
}
