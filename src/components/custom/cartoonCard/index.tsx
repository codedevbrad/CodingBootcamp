"use client";

interface CartoonCardProps {
  title: string;
  label?: string;
  children: React.ReactNode;
  className?: string; // extra Tailwind overrides
}

export default function CartoonCard({
  title,
  label,
  children,
  className = "",
}: CartoonCardProps) {
  return (
    <div className="mt-12 flex justify-center w-full">
      <div
        className={`
          relative w-full max-w-2xl
          rounded-2xl p-8
          bg-white 
          border-4 border-black
          shadow-[6px_6px_0px_#000]
          transition hover:shadow-[10px_10px_0px_#000]
          ${className}
        `}
      >
        {/* Optional decorative label */}
        {label && (
          <div
            className="
              absolute -top-4 left-6 
              bg-pink-300 border-2 border-black 
              px-4 py-1 rounded-md 
              font-semibold text-sm
              shadow-[3px_3px_0px_#000]
            "
          >
            {label}
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          { title }
        </h1>

        {/* Content */}
        {children}

        {/* Decorative vertical bar */}
        <div
          className="
            absolute -right-1 top-6 h-[85%] 
            w-2 bg-black 
            rounded-full 
            shadow-[3px_3px_0px_#000]
          "
        ></div>
      </div>
    </div>
  );
}
