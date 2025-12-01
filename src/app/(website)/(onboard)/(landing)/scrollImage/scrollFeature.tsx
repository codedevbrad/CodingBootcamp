"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

interface BootcampSection {
  id: string;
  title: string;
  subtitle: string;
  paragraph?: string;
  image: string;
}

interface Props {
  initialImage: string;
  sections: BootcampSection[];
}

export default function ScrollBootcampFeature({ initialImage, sections }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeSection, setActiveSection] = useState<string | null>(null);

  /* -------------------------------------------------
     PHASE 1 — HERO SHIFT (enabled)
  ------------------------------------------------- */
  const { scrollYProgress } = useScroll({ target: containerRef });

  const x = useTransform(scrollYProgress, [0, 0.25], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 0.25], [1, 0.8]);

  // NEW → animate width from 80vw → 50vw
  const width = useTransform(scrollYProgress, [0, 0.25], ["80vw", "50vw"]);

  return (
    <div ref={containerRef} className="relative w-full my-[60px] mt-[300px]">

      {/* ---------------- PINNED IMAGE RIGHT ---------------- */}
      <div className="sticky top-24 h-[78vh] flex items-center justify-center pointer-events-none">
        <motion.div
          style={{ x, scale, width }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={activeSection ?? "initial"}
              src={
                activeSection
                  ? sections.find((s) => s.id === activeSection)?.image
                  : initialImage
              }
              className="w-full rounded-2xl shadow-2xl"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.30 }}
            />
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ---------------- LEFT CONTENT ---------------- */}
      <div className="max-w-xl pt-40 pl-6 space-y-20 pb-[300px]">
        {sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
          />
        ))}
      </div>

    </div>
  );
}

/* ----------------------------------------------------------- */
/* CLICKABLE SECTION */
/* ----------------------------------------------------------- */

function SectionBlock({
  section,
  isActive,
  onClick,
}: {
  section: BootcampSection;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        p-6 rounded-xl cursor-pointer select-none
        bg-white/70 dark:bg-zinc-900/50 backdrop-blur-md 
        border transition-colors duration-300
        ${isActive ? "border-blue-500 shadow-lg" : "border-zinc-200/40 dark:border-zinc-800/40"}
      `}
    >
      <h2
        className={`
          text-4xl font-bold mb-2 transition-colors duration-300
          ${isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-900 dark:text-white"}
        `}
      >
        {section.title}
      </h2>

      <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-3">
        {section.subtitle}
      </p>

      {section.paragraph && (
        <p className="text-md text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {section.paragraph}
        </p>
      )}
    </div>
  );
}
