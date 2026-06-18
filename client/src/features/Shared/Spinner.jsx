export const Spinner = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0a] gap-4">
    <div className="w-9 h-9 border-[3px] border-[#333] border-t-white rounded-full animate-spin" />

    <p className="text-[#666] text-[11px] tracking-[0.2em] uppercase m-0">
      Onyx
    </p>
  </div>
);
