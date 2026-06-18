import { useDispatch } from "react-redux";
import { setSellerProduct, setProducts } from "../state/product.slice.js";
import {
    createProduct,
    getSellerProduct,
    getAllproducts
} from "../service/product.api";

export const useProduct = () => {
    const dispatch = useDispatch();

    const handleCreateProduct = async (formData) => {
        try {
            const data = await createProduct(formData);
            return data.products;
        } catch (error) {
            console.error("Create product failed:", error);
            throw error;
        }
    };

    const handleGetSellerProduct = async () => {
        try {
            const data = await getSellerProduct();

            dispatch(setSellerProduct(data.products));

            return data.products;
        } catch (error) {
            console.error("Fetch seller products failed:", error);
            throw error;
        }
    };

    const handleGetAllProducts = async () => {
        try {
            const data = await getAllProducts();

            dispatch(setProducts(data.products));

            return data.products;
        } catch (error) {
            console.error("Fetch all products failed:", error);
            throw error;
        }
    };

    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
    };
};