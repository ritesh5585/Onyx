import React from "react";

const AddressCard = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}) => {
  const {
    _id,
    name,
    phone,
    alternativePhone,
    addressLine,
    city,
    state,
    zip,
    country,
    isDefault,
  } = address;

  return (
    <div
      onClick={() => onSelect(address)}
      className={`group relative cursor-pointer rounded-xl border p-4 sm:p-5 transition-all duration-300 ${
        isSelected
          ? "border-onyx-gold bg-onyx-card shadow-[0_0_24px_rgba(196,154,82,0.14)]"
          : "border-onyx-border/70 bg-onyx-surface hover:border-onyx-gold/40 hover:bg-onyx-card/50"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Radio & Recipient Info */}
        <div className="flex items-start gap-3 min-w-0">
          {/* Radio Indicator */}
          <div
            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
              isSelected
                ? "border-onyx-gold bg-onyx-gold shadow-[0_0_8px_rgba(196,154,82,0.5)]"
                : "border-onyx-muted2 group-hover:border-onyx-gold/60"
            }`}
          >
            {isSelected && (
              <span className="h-1.5 w-1.5 rounded-full bg-onyx-black" />
            )}
          </div>

          {/* Details */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif text-base sm:text-lg font-medium tracking-wide text-onyx-text">
                {name}
              </span>
              {isDefault && (
                <span className="rounded-full border border-onyx-gold/40 bg-onyx-gold-muted px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-onyx-gold">
                  Default
                </span>
              )}
            </div>

            <p className="mt-1.5 text-[13px] leading-relaxed text-onyx-text/80">
              {addressLine}
            </p>
            <p className="text-[12px] text-onyx-muted">
              {city}, {state} - <span className="text-onyx-text/90">{zip}</span>
              {country && country !== "India" ? `, ${country}` : ""}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-onyx-muted/80">
              <span className="flex items-center gap-1">
                <span>📞</span>
                <span className="text-onyx-text/90">{phone}</span>
              </span>
              {alternativePhone && (
                <span className="text-onyx-muted/60">
                  · Alt: {alternativePhone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        <div
          className="flex items-center gap-2 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(address)}
              className="rounded-md p-1.5 text-xs text-onyx-muted transition-colors hover:bg-white/5 hover:text-onyx-gold"
              title="Edit address"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(_id)}
              className="rounded-md p-1.5 text-xs text-onyx-muted transition-colors hover:bg-white/5 hover:text-red-400"
              title="Delete address"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Set Default Action */}
      {!isDefault && onSetDefault && (
        <div
          className="mt-3.5 flex justify-end border-t border-onyx-border/40 pt-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onSetDefault(_id)}
            className="text-[10px] uppercase tracking-[0.14em] text-onyx-muted/70 transition-colors hover:text-onyx-gold"
          >
            Set as default
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
