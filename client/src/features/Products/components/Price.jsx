import React from "react";

const Price = ({
  formData,
  handleChange,
  CURRENCIES,
}) => {
  return (
    <div>
      <label className="onyx-label block mb-2">Price</label>
      <div className="grid grid-cols-[1fr_130px] gap-3 mt-2">
        <div>
          <p className="onyx-label mb-1.5">Amount</p>
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
        <div>
          <p className="onyx-label mb-1.5">Currency</p>
          <select
            name="priceCurrency"
            value={formData.priceCurrency}
            onChange={handleChange}
            className="onyx-input cursor-pointer"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c} className="bg-[#111]">
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
