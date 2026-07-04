 export const VariantSelector = ({ attributes, selectedOptions, onOptionSelect }) => (
    <div className="mb-8 flex flex-col gap-6">
        {Object.entries(attributes).map(([attrName, attrValues]) => (
            <div key={attrName}>
                <h3 className="onyx-label mb-3">{attrName}</h3>
                <div className="flex flex-wrap gap-3">
                    {attrValues.map((val) => {
                        const isSelected = selectedOptions[attrName] === val;
                        return (
                            <button
                                key={val}
                                onClick={() => onOptionSelect(attrName, val)}
                                className={`px-4 py-2 rounded-lg border transition-colors ${isSelected
                                        ? "border-[#c49a52] bg-[#c49a52]/10 text-[#c49a52]"
                                        : "border-[#1f1f1f] bg-[#0f0f13] text-[#eee9e1] hover:border-[#c49a52]/50"
                                    }`}
                            >
                                {val}
                            </button>
                        );
                    })}
                </div>
            </div>
        ))}
    </div>
);