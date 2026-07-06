import React from "react";

const Price = ({ formData, handleChange, CURRENCIES }) => {
  return (
    <div>
      <label className="onyx-label block mb-3">Pricing</label>
      <div className="grid grid-cols-[1fr_120px] gap-3">
        <div className="flex flex-col gap-2">
          <p className="onyx-label">Amount</p>
          <input
            type="number"
            name="priceAmount"
            value={formData.priceAmount}
            onChange={handleChange}
            placeholder="0.00"
            required
            min="0"
            step="0.01"
            className="onyx-input"
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="onyx-label">Currency</p>
          <select
            name="priceCurrency"
            value={formData.priceCurrency}
            onChange={handleChange}
            className="onyx-input cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-[#0d0d12]">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Price;
