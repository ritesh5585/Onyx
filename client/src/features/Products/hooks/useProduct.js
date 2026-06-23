import { useDispatch } from "react-redux";
import { setSellerProduct, setProducts, setDetails } from "../state/product.slice.js";
import {
    createProduct,
    getSellerProduct,
    getAllproducts,
    getProductDetail,
    addProductvariants,
    updateProductInfo
} from "../service/product.api";

export const useProduct = () => {
    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) => {
        try {
            const data = await createProduct(formData);
            return data.product;
        } catch (error) {
            console.error("Create product failed:", error);
            throw error;
        }
    };

    const handleGetSellerProduct = async () => {
        try {
            const data = await getSellerProduct();
            dispatch(setSellerProduct(data?.products));
            return data;
        } catch (error) {
            console.error("Fetch seller products failed:", error);
            throw error;
        }
    };

    const handleGetAllProducts = async () => {
        try {
            const data = await getAllproducts();
            dispatch(setProducts(data?.products));
            return data;
        } catch (error) {
            console.error("Fetch all products failed:", error);
            throw error;
        }
    };

    const handleProductDetails = async (productId) => {
        try {
            const data = await getProductDetail(productId);
            dispatch(setDetails(data?.product));
            return data.product;
        } catch (error) {
            console.error("Fetch products detail failed:", error);
            throw error;
        }
    };

    /**
     * Submits an array of new variant objects to the backend and refreshes the
     * product details in Redux so the UI reflects the saved state.
     * @param {string} productId
     * @param {Array<{name:string, value:string, stock:string|number, extraPrice:string|number}>} variants
     */
    const handleProductVariants = async (productId, variants) => {
        try {
            const data = await addProductvariants(productId, variants);
            // Refresh stored product so variants list re-renders from truth
            dispatch(setDetails(data?.product));
            return data.product;
        } catch (error) {
            console.error("Add variants failed:", error);
            throw error;
        }
    };

    /**
     * PATCHes the product's editable info and refreshes Redux state.
     * @param {string} productId
     * @param {{title?:string, description?:string, priceAmount?:number, priceCurrency?:string}} payload
     */
    const handleUpdateProduct = async (productId, payload) => {
        try {
            const data = await updateProductInfo(productId, payload);
            dispatch(setDetails(data?.product));
            return data.product;
        } catch (error) {
            console.error("Update product failed:", error);
            throw error;
        }
    };

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleProductDetails,
        handleProductVariants,
        handleUpdateProduct,
    };
};