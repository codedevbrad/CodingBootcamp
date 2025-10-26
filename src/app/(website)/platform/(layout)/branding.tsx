"use client";

export default function HeaderBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        <div>
          <h1 className="text-lg md:text-xl font-semibold tracking-wide">
            TheCodeBootcamp
          </h1>
          <p className="text-sm text-white/80">
            Learn. Build. Master — Your journey to becoming a full-stack pro.
          </p>
        </div>

        <div className="hidden md:block mt-2 md:mt-0 text-sm text-white/90 italic">
          “Every great developer was once a beginner who didn’t quit.”
        </div>
      </div>
    </div>
  );
}
