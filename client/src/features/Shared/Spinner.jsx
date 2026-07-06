export const Spinner = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-[#06060a] gap-5">
    {/* Thin gold ring spinner */}
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border border-[rgba(255,255,255,0.06)]" />
      <div
        className="absolute inset-0 rounded-full border-t border-[#c49a52] animate-spin"
        style={{ animationDuration: "0.9s", animationTimingFunction: "linear" }}
      />
    </div>
    <p
      className="text-[9px] tracking-[0.4em] uppercase m-0"
      style={{ color: "rgba(238,233,225,0.25)", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      ONYX
    </p>
  </div>
);
