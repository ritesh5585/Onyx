import React, { memo } from "react";

export const VariantSelector = memo(({
  attributes,
  selectedOptions,
  onOptionSelect,
}) => (
  <div className="mb-8 flex flex-col gap-7">
    {Object.entries(attributes).map(([attrName, attrValues]) => (
      <div key={attrName}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="onyx-label">{attrName}</h3>
          {selectedOptions[attrName] && (
            <span className="text-[11px] text-[rgba(238,233,225,0.5)] tracking-wide">
              {selectedOptions[attrName]}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2.5">
          {attrValues.map((val) => {
            const isSelected = selectedOptions[attrName] === val;
            return (
              <button
                key={val}
                onClick={() => onOptionSelect(attrName, val)}
                className={`px-4 py-2 text-[12px] font-medium tracking-[0.06em] border transition-all duration-200 rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[#c49a52] ${
                  isSelected
                    ? "border-[#c49a52] bg-[rgba(196,154,82,0.08)] text-[#c49a52]"
                    : "border-[rgba(255,255,255,0.1)] bg-transparent text-[rgba(238,233,225,0.6)] hover:border-[rgba(255,255,255,0.25)] hover:text-[#eee9e1]"
                }`}
                aria-pressed={isSelected}
                aria-label={`${attrName}: ${val}`}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>
    ))}
  </div>
));
