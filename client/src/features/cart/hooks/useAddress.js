import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../service/address.api";
import { toast } from "sonner";

export const useAddress = () => {
  const user = useSelector((state) => state.auth.user);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setSelectedAddress(null);
      return [];
    }

    setIsLoading(true);
    try {
      const data = await getAddresses();
      const list = data.addresses || [];
      setAddresses(list);

      // Auto-select: pick the default address, or the first address if no default
      if (list.length > 0) {
        setSelectedAddress((prev) => {
          if (prev && list.some((a) => a._id === prev._id)) {
            // Keep current selection if still valid
            return list.find((a) => a._id === prev._id) || prev;
          }
          const defaultAddr = list.find((a) => a.isDefault);
          return defaultAddr || list[0];
        });
      } else {
        setSelectedAddress(null);
      }
      return list;
    } catch (err) {
      console.error("Failed to load addresses", err);
      // Suppress toast on initial load if user has no addresses
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const saveAddress = useCallback(
    async (formData) => {
      setIsLoading(true);
      try {
        const data = await addAddress(formData);
        const created = data.address;
        toast.success("Delivery address saved successfully");
        await fetchAddresses();
        setSelectedAddress(created);
        return created;
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Failed to save address";
        toast.error(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAddresses]
  );

  const updateAddressItem = useCallback(
    async (id, formData) => {
      setIsLoading(true);
      try {
        const data = await updateAddress(id, formData);
        const updated = data.address;
        toast.success("Address updated");
        await fetchAddresses();
        if (selectedAddress?._id === id) {
          setSelectedAddress(updated);
        }
        return updated;
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Failed to update address";
        toast.error(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAddresses, selectedAddress]
  );

  const removeAddress = useCallback(
    async (id) => {
      setIsLoading(true);
      try {
        await deleteAddress(id);
        toast.success("Address removed");
        const list = await fetchAddresses();
        if (selectedAddress?._id === id) {
          const nextSelected = list.find((a) => a.isDefault) || list[0] || null;
          setSelectedAddress(nextSelected);
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Failed to remove address";
        toast.error(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAddresses, selectedAddress]
  );

  const makeDefault = useCallback(
    async (id) => {
      try {
        await setDefaultAddress(id);
        toast.success("Default address updated");
        await fetchAddresses();
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Failed to set default address";
        toast.error(msg);
      }
    },
    [fetchAddresses]
  );

  return {
    addresses,
    selectedAddress,
    isLoading,
    fetchAddresses,
    saveAddress,
    updateAddressItem,
    removeAddress,
    makeDefault,
    selectAddress: setSelectedAddress,
  };
};
