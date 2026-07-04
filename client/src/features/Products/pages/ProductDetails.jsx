import React, { useEffect, useState, useMemo } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { Spinner } from "../../Shared/Spinner";
import Layout from "../../Shared/Layout";
import ImageGallery from "../components/ImageGallery";
import ProductOverview from "../components/ProductOverview";
import { readAttributes } from "../utils/variantUtils";
import { useCart } from "../../cart/hooks/useCart";
import { VariantSelector } from "../utils/variantSelector";
import Toast from "../../Shared/Toast";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "", visible: false });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const detail = useSelector((state) => state.product.details);
  const { handleProductDetails } = useProduct();
  const { handleAddtoCart } = useCart();

  useEffect(() => {
    if (productId) handleProductDetails(productId);
  }, [productId]);

  const parsedVariants = useMemo(() => {
    if (!detail?.variants?.length) return { attributes: {}, variantsList: [] };
    const attributes = {};
    const variantsList = detail.variants.map((v) => {
      const parsedAttrs = Object.fromEntries(readAttributes(v.attributes));
      Object.entries(parsedAttrs).forEach(([key, value]) => {
        if (!attributes[key]) attributes[key] = new Set();
        attributes[key].add(value);
      });
      return { ...v, parsedAttrs };
    });

    Object.keys(attributes).forEach((key) => {
      attributes[key] = Array.from(attributes[key]);
    });

    return { attributes, variantsList };
  }, [detail]);

  useEffect(() => {
    if (Object.keys(parsedVariants.attributes).length > 0) {
      const initialOptions = {};
      Object.entries(parsedVariants.attributes).forEach(([key, values]) => {
        initialOptions[key] = values[0];
      });
      setSelectedOptions(initialOptions);
      setSelectedImage(0);
    } else {
      setSelectedOptions({});
      setSelectedImage(0);
    }
  }, [parsedVariants.attributes]);

  const resolvedVariant = useMemo(() => {
    if (
      !parsedVariants.variantsList.length ||
      !Object.keys(selectedOptions).length
    )
      return null;
    return parsedVariants.variantsList.find((variant) =>
      Object.entries(selectedOptions).every(
        ([key, val]) => variant.parsedAttrs[key] === val,
      ),
    );
  }, [parsedVariants.variantsList, selectedOptions]);

  if (!detail) return <Spinner />;

  const imageUrls = (resolvedVariant?.images?.length
    ? resolvedVariant.images
    : detail.images
  )?.map((img) => img.url) || [
    "https://placehold.co/600x800/15151c/eee9e1?text=No+Image",
  ];

  const activePrice = resolvedVariant?.price?.amount
    ? resolvedVariant.price
    : detail.price;

  const hasVariants = detail.variants?.length > 0;
  
  const stockNotAvailable = hasVariants 
    ? (!resolvedVariant || resolvedVariant.stock <= 0) 
    : (detail.stock <= 0);
    
  const isOutOfStock = stockNotAvailable;

  const stockStatus = !hasVariants
    ? (detail.stock > 0 ? `${detail.stock} In Stock` : "Out of Stock")
    : !resolvedVariant
      ? "Variant Unavailable"
      : resolvedVariant.stock > 0
        ? `${resolvedVariant.stock} In Stock`
        : "Out of Stock";

  const onAddToCart = async () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    try {
      await handleAddtoCart(detail._id, resolvedVariant?._id || null);
      showToast("Item added to cart successfully!", "success");
    } catch (err) {
      console.error("Add to cart failed", err);
      showToast(err?.response?.data?.message || err?.message || "Failed to add item to cart.", "error");
    } finally {
      setIsAdding(false);
    }
  };

  const onBuyNow = async () => {
    if (isOutOfStock) return;
    try {
      await onAddToCart();
      navigate("/cart");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {toast.visible && (
        <div className="fixed top-4 right-4 z-[9999]">
          <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
        </div>
      )}
      <Layout showBackButton={true}>
        <div className="pt-10 pb-28 md:pt-16 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <ImageGallery
            mainImage={imageUrls[selectedImage] || imageUrls[0]}
            imageUrls={imageUrls}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            title={detail.title}
          />

          <div className="flex flex-col">
            <ProductOverview
              title={detail.title}
              priceAmount={activePrice?.amount}
              priceCurrency={activePrice?.currency}
              description={detail.description}
            />

            <div className="flex-grow">
              {Object.keys(parsedVariants.attributes).length > 0 && (
                <VariantSelector
                  attributes={parsedVariants.attributes}
                  selectedOptions={selectedOptions}
                  onOptionSelect={(attr, val) => {
                    setSelectedOptions((prev) => ({ ...prev, [attr]: val }));
                    setSelectedImage(0);
                  }}
                />
              )}

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <h3 className="onyx-label">Availability</h3>
                  <p
                    className={`text-sm ${isOutOfStock ? "text-red-400" : "text-[#eee9e1]"}`}
                  >
                    {stockStatus}
                  </p>
                </div>
                <div>
                  <h3 className="onyx-label">Shipping</h3>
                  <p className="text-sm text-[#eee9e1]">Ships in 2-3 days</p>
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0a] border-t border-[#1f1f1f] flex flex-row gap-4 z-50 md:px-8 lg:px-20">
              <button
                type="button"
                onClick={onAddToCart}
                disabled={isOutOfStock || isAdding || stockNotAvailable}
                className={`onyx-btn-secondary flex-1 ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isAdding ? "ADDING..." : "ADD TO CART"}
              </button>
              <button
                type="button"
                onClick={onBuyNow}
                disabled={isOutOfStock || isAdding}
                className={`onyx-btn-primary flex-1 ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
      </Layout>
    </>
  );
};

export default ProductDetails;
