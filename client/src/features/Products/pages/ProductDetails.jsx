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
import { VariantSelector } from "../components/variantSelector";
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
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
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
    "https://placehold.co/600x800/0d0d12/eee9e1?text=No+Image",
  ];

  const activePrice = resolvedVariant?.price?.amount
    ? resolvedVariant.price
    : detail.price;

  const hasVariants = detail.variants?.length > 0;

  const stockNotAvailable = hasVariants
    ? !resolvedVariant || resolvedVariant.stock <= 0
    : detail.stock <= 0;

  const isOutOfStock = stockNotAvailable;

  const stockStatus = !hasVariants
    ? detail.stock > 0
      ? `${detail.stock} in stock`
      : "Out of stock"
    : !resolvedVariant
      ? "Combination unavailable"
      : resolvedVariant.stock > 0
        ? `${resolvedVariant.stock} in stock`
        : "Out of stock";

  const onAddToCart = async () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    try {
      await handleAddtoCart(detail._id, resolvedVariant?._id || null);
      showToast("Item added to cart successfully!", "success");
    } catch (err) {
      console.error("Add to cart failed", err);
      showToast(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add item to cart.",
        "error",
      );
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
      {toast.visible && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast((prev) => ({ ...prev, visible: false }))} />}

      <Layout showBackButton={true}>
        <div className="pt-8 pb-36 md:pt-12 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-24">

            {/* ── Image Gallery ── */}
            <ImageGallery
              mainImage={imageUrls[selectedImage] || imageUrls[0]}
              imageUrls={imageUrls}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              title={detail.title}
            />

            {/* ── Product Info ── */}
            <div className="flex flex-col">
              <ProductOverview
                title={detail.title}
                priceAmount={activePrice?.amount}
                priceCurrency={activePrice?.currency}
                description={detail.description}
              />

              {/* Variants */}
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

              {/* Availability + Shipping */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0d0d12]">
                  <h3 className="onyx-label mb-2">Availability</h3>
                  <p className={`text-[13px] font-medium ${isOutOfStock ? "text-[#e57373]" : "text-[#81c784]"}`}>
                    {stockStatus}
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#0d0d12]">
                  <h3 className="onyx-label mb-2">Shipping</h3>
                  <p className="text-[13px] font-medium text-[rgba(238,233,225,0.65)]">Ships in 2–3 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Fixed Bottom CTA Bar ── */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(255,255,255,0.07)] bg-[rgba(6,6,10,0.95)] backdrop-blur-xl">
          <div className="onyx-container py-4 flex flex-row gap-3">
            <button
              type="button"
              onClick={onAddToCart}
              disabled={isOutOfStock || isAdding || stockNotAvailable}
              className="onyx-btn-secondary flex-1"
              aria-label="Add to cart"
            >
              {isAdding ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
                  Adding…
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>
            <button
              type="button"
              onClick={onBuyNow}
              disabled={isOutOfStock || isAdding}
              className="onyx-btn-primary flex-1"
              aria-label="Buy now"
            >
              {isOutOfStock ? "Out of Stock" : "Buy Now"}
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProductDetails;
