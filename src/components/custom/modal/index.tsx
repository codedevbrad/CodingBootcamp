"use client"

interface FullscreenModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function FullscreenModal({
  open,
  onClose,
  children,
}: FullscreenModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        backdrop-blur-md bg-black/40
        flex justify-center items-center
        p-6 w-full h-full
      "
    >
      {/* CLICK OUTSIDE TO CLOSE */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* CONTENT */}
      <div
        className="
          relative z-10
          w-full max-w-[90%]
          bg-white dark:bg-zinc-900
          rounded-xl shadow-2xl
          border border-black/10 dark:border-white/10
          p-6
          max-h-[90vh] overflow-y-hidden
        "
      >
            <div className="overflow-y-auto max-h-[80vh]">
                {children}
            </div>
      </div>
    </div>
  );
}
