import { useDispatch } from "react-redux";
import { setSellerProduct, setProducts, setDetails } from "../state/product.slice.js";
import {
    createProduct,
    getSellerProduct,
    getAllproducts,
    getProductDetail,
    addProductvariants,
    updateProductInfo,
    deleteProduct,
    deleteProductVariant
} from "../service/product.api";
import { useCallback } from "react";

export const useProduct = () => {
    const dispatch = useDispatch();

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

    const handleGetAllProducts = useCallback(async () => {
        try {
            const data = await getAllproducts();
            dispatch(setProducts(data?.products));
            return data;
        } catch (error) {
            console.error("Fetch all products failed:", error);
            throw error;
        }
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
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleProductDetails,
        handleProductVariants,
        handleUpdateProduct,
        handleDeleteProduct,
        handleDeleteVariant
    };
};