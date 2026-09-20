import api from "../../../services/api.baseurl.js";

/**
 * Fetch all saved delivery addresses for the authenticated user
 */
export const getAddresses = async () => {
  const res = await api.get("/address");
  return res.data;
};

/**
 * Add a new delivery address
 */
export const addAddress = async (addressData) => {
  const res = await api.post("/address", addressData);
  return res.data;
};

/**
 * Update an existing delivery address
 */
export const updateAddress = async (addressId, addressData) => {
  const res = await api.put(`/address/${addressId}`, addressData);
  return res.data;
};

/**
 * Delete a delivery address
 */
export const deleteAddress = async (addressId) => {
  const res = await api.delete(`/address/${addressId}`);
  return res.data;
};

/**
 * Set an address as the default delivery address
 */
export const setDefaultAddress = async (addressId) => {
  const res = await api.patch(`/address/${addressId}/default`);
  return res.data;
};
