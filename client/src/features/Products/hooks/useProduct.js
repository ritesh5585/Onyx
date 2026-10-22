import { useDispatch, useSelector } from "react-redux";
import { setSellerProduct, setProducts, setDetails, setCategories, setFilters, resetFilters } from "../state/product.slice.js";
import {
    createProduct,
    getSellerProduct,
    getAllproducts,
    getProductCategories,
    getProductDetail,
    addProductvariants,
    updateProductInfo,
    deleteProduct,
    deleteProductVariant
} from "../service/product.api";
import { useCallback } from "react";

export const useProduct = () => {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.product?.filters);
    const categories = useSelector((state) => state.product?.categories);

    const handleCreateProduct = useCallback(async (formData) => {
        try {
            const data = await createProduct(formData);
            return data.product;
        } catch (error) {
            console.error("Create product failed:", error);
            throw error;
        }
    }, []);

    const handleGetSellerProduct = useCallback(async () => {
        try {
            const data = await getSellerProduct();
            dispatch(setSellerProduct(data?.products));
            return data;
        } catch (error) {
            console.error("Fetch seller products failed:", error);
            throw error;
        }
    }, [dispatch]);

    const handleGetAllProducts = useCallback(async (params = {}) => {
        try {
            const data = await getAllproducts(params);
            dispatch(setProducts(data?.products));
            return data;
        } catch (error) {
            console.error("Fetch all products failed:", error);
            throw error;
        }
    }, [dispatch]);

    const handleGetCategories = useCallback(async () => {
        try {
            const data = await getProductCategories();
            dispatch(setCategories(data?.categories || []));
            return data?.categories;
        } catch (error) {
            console.error("Fetch categories failed:", error);
            return [];
        }
    }, [dispatch]);

    const handleSetFilters = useCallback((newFilters) => {
        dispatch(setFilters(newFilters));
    }, [dispatch]);

    const handleResetFilters = useCallback(() => {
        dispatch(resetFilters());
    }, [dispatch]);

    const handleProductDetails = useCallback(async (productId) => {
        try {
            const data = await getProductDetail(productId);
            dispatch(setDetails(data?.product));
            return data.product;
        } catch (error) {
            console.error("Fetch products detail failed:", error);
            throw error;
        }
    }, [dispatch]);

    const handleProductVariants = useCallback(async (productId, variants) => {
        try {
            const data = await addProductvariants(productId, variants);
            dispatch(setDetails(data?.product));
            return data.product;
        } catch (error) {
            console.error("Add variants failed:", error);
            throw error;
        }
    }, [dispatch]);

    const handleUpdateProduct = useCallback(async (productId, payload) => {
        try {
            const data = await updateProductInfo(productId, payload);
            dispatch(setDetails(data?.product));
            return data.product;
        } catch (error) {
            console.error("Update product failed:", error);
            throw error;
        }
    }, [dispatch]);

    const handleDeleteProduct = useCallback(async (productId) => {
        try {
            const data = await deleteProduct(productId);
            return data;
        } catch (error) {
            console.error("Delete product failed:", error);
            throw error;
        }
    }, []);

    const handleDeleteVariant = useCallback(async (productId, variantId) => {
        try {
            const data = await deleteProductVariant(productId, variantId);
            dispatch(setDetails(data?.product));
            return data.product;
        } catch (error) {
            console.error("Delete variant failed:", error);
            throw error;
        }
    }, [dispatch]);

    return {
        filters,
        categories,
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleGetCategories,
        handleSetFilters,
        handleResetFilters,
        handleProductDetails,
        handleProductVariants,
        handleUpdateProduct,
        handleDeleteProduct,
        handleDeleteVariant
    };
};