"use client";

export default function Modal({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-[rgba(30,20,40,0.4)] flex items-center justify-center z-[100] p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FFFDFB] rounded-[20px] p-7 w-full max-w-[420px] max-h-[85vh] overflow-y-auto shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-[18px] right-[18px] w-7 h-7 rounded-full bg-[#F2ECF9] flex items-center justify-center"
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B4FA0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
