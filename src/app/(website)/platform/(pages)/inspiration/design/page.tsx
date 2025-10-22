"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, XCircle } from "lucide-react";

interface InspoItem {
  id: string;
  title: string;
  tags: string[];
  image: string;
}

const allItems: InspoItem[] = [
  { id: "1", title: "Dashboard Layout", tags: ["dashboard", "web"], image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80" },
  { id: "2", title: "E-Commerce App", tags: ["dashboard", "ecommerce", "dark"], image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80" },
  { id: "3", title: "Landing Hero Section", tags: ["landing", "marketing"], image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80" },
  { id: "4", title: "Portfolio Grid", tags: ["portfolio", "creative"], image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80" },
];

export default function UIInspirationPage() {
  const [selected, setSelected] = useState<InspoItem | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const tags = Array.from(new Set(allItems.flatMap((i) => i.tags)));

  // 🧩 Filtering
  const filtered =
    activeTags.length === 0
      ? allItems
      : allItems.filter((item) => item.tags.some((tag) => activeTags.includes(tag)));

  // 🧮 Tag count helper
  const getTagCount = (tag: string) =>
    allItems.filter((item) => item.tags.includes(tag)).length;

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => setActiveTags([]);

  return (
    <main className="min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div
            key="grid"
            initial="hidden"
            animate="show"
            exit={{ x: "-50%", opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h1 className="text-4xl font-sans mb-8 text-foreground text-center">
              UI Design Inspiration
            </h1>

            {/* 🏷️ Filter Bar with Counts */}
            <div className="flex flex-wrap items-center gap-2 mb-10 justify-center">
              {tags.map((tag) => {
                const count = getTagCount(tag);
                const active = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`cursor-pointer flex items-center gap-1 px-3 py-1 text-sm rounded-full border transition-all
                      ${
                        active
                          ? "bg-primary text-primary-foreground border-primary"
                          : ""
                      }`}
                  >
                    <span>{tag}</span>
                    <span
                      className={`text-xs font-medium rounded-full px-2 py-[2px] ${
                        active
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted-foreground/10 text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}

              {activeTags.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
                >
                  <XCircle className="w-4 h-4" /> Clear
                </button>
              )}
            </div>

            {/* 🧱 Grid of Items */}
            <motion.div
              layout
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr"
            >
              {filtered.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  onClick={() => setSelected(item)}
                  className="group relative overflow-hidden rounded-lg cursor-pointer bg-gray-100"
                >
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[260px] object-cover rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute bottom-4 right-4">
                    <div className="backdrop-blur-sm bg-black/40 text-white px-3 py-1.5 rounded-md text-sm">
                      {item.title}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          // 🧭 Detail View
          <motion.div
            key="detail"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="inset-0 p-6 md:p-12 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-full hover:bg-muted transition cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6 text-foreground" />
              </button>
              <h2 className="text-3xl font-sans text-foreground">
                {selected.title}
              </h2>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center">
              <motion.img
                src={selected.image}
                alt={selected.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-[60vh] object-cover rounded-xl"
              />
              <p className="text-muted-foreground mt-6 text-center max-w-lg">
                You’re now viewing <strong>{selected.title}</strong>. This space could display
                screenshots, color palettes, or layout breakdowns.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
