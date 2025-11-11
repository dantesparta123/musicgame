import React from "react";

export function GameDialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-[#222] text-[#f4f4f5] rounded-2xl shadow-2xl px-8 py-6 min-w-[320px] max-w-[90vw] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
} 