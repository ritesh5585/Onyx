// const user = useSelector((state) => state.auth.user);
import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
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
import { toast } from "sonner";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const detail = useSelector((state) => state.product.details);
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items?.items) || [];
  const { handleProductDetails } = useProduct();
  const { handleAddtoCart } = useCart();

  useEffect(() => {
    if (productId) handleProductDetails(productId);
  }, [productId, handleProductDetails]);

  const parsedVariants = useMemo(() => {
    if (!detail?.variants?.length) return { attributes: {}, variantsList: [] };
    const attributes = {};
    const variantsList = detail.variants.map((v) => {
      const parsedAttrs = Object.fromEntries(readAttributes(v.attributes));
      Object.entries(parsedAttrs).forEach(([k, val]) =>
        (attributes[k] ??= new Set()).add(val),
      );
      return { ...v, parsedAttrs };
    });
    Object.keys(attributes).forEach(
      (k) => (attributes[k] = [...attributes[k]]),
    );
    return { attributes, variantsList };
  }, [detail]);

  useEffect(() => {
    const attrEntries = Object.entries(parsedVariants.attributes);
    setSelectedOptions(
      attrEntries.length > 0
        ? Object.fromEntries(attrEntries.map(([k, vals]) => [k, vals[0]]))
        : {},
    );
    setSelectedImage(0);
  }, [parsedVariants.attributes]);

  const resolvedVariant = useMemo(() => {
    if (
      !parsedVariants.variantsList.length ||
      !Object.keys(selectedOptions).length
    )
      return null;
    return parsedVariants.variantsList.find((v) =>
      Object.entries(selectedOptions).every(
        ([k, val]) => v.parsedAttrs[k] === val,
      ),
    );
  }, [parsedVariants.variantsList, selectedOptions]);

  const isInCart = useMemo(() => {
    return cartItems.some(
      (item) =>
        item.product?._id === detail?._id &&
        (resolvedVariant
          ? item.variant?._id === resolvedVariant._id
          : !item.variant),
    );
  }, [cartItems, detail?._id, resolvedVariant]);

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
  const activeStock = hasVariants ? resolvedVariant?.stock : detail.stock;
  const isOutOfStock = activeStock === undefined || activeStock <= 0;

  const stockStatus =
    hasVariants && !resolvedVariant
      ? "Combination unavailable"
      : !isOutOfStock
        ? `${activeStock} in stock`
        : "Out of stock";

  const onAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return false;
    }
    if (isInCart) {
      navigate("/getyourcart");
      return true;
    }
    if (isOutOfStock) return false;
    setIsAdding(true);
    try {
      await handleAddtoCart(detail._id, resolvedVariant?._id || null);
      toast.success("Item added to cart successfully!");
      return true;
    } catch (err) {
      console.error("Add to cart failed", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to add item to cart.",
      );
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const onBuyNow = async () => {
    if (await onAddToCart()) navigate("/getyourcart");
  };

  return (
    <>
      <Layout showBackButton={true}>
        <div className="pt-6 sm:pt-8 pb-32 sm:pb-36 md:pt-12 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 xl:gap-24">
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
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="p-3 sm:p-4 rounded-lg border border-onyx-border/70 bg-onyx-surface">
                  <h3 className="onyx-label mb-1.5 sm:mb-2">Availability</h3>
                  <p
                    className={`text-[13px] font-medium ${isOutOfStock ? "text-[#e57373]" : "text-[#81c784]"}`}
                  >
                    {stockStatus}
                  </p>
                </div>
                <div className="p-3 sm:p-4 rounded-lg border border-onyx-border/70 bg-onyx-surface">
                  <h3 className="onyx-label mb-1.5 sm:mb-2">Shipping</h3>
                  <p className="text-[13px] font-medium text-onyx-muted">
                    Ships in 2–3 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Fixed Bottom CTA Bar ── */}
        {createPortal(
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-onyx-border/70 bg-onyx-black/95 backdrop-blur-xl">
            <div className="onyx-container py-3 sm:py-4 flex flex-row gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onAddToCart}
                disabled={!isInCart && (isOutOfStock || isAdding)}
                className="onyx-btn-secondary flex-1 !py-3 sm:!py-3.5 text-[11px] sm:text-[12px]"
                aria-label={isInCart ? "Go to cart" : "Add to cart"}
              >
                {isAdding ? (
                  <span className="flex items-center gap-1.5 sm:gap-2 justify-center">
                    <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-current border-t-transparent animate-spin" />
                    Adding…
                  </span>
                ) : isInCart ? (
                  "Go to Cart"
                ) : (
                  "Add to Cart"
                )}
              </button>
              <button
                type="button"
                onClick={onBuyNow}
                disabled={isOutOfStock || isAdding}
                className="onyx-btn-primary flex-1 !py-3 sm:!py-3.5 text-[11px] sm:text-[12px]"
                aria-label="Buy now"
              >
                {isOutOfStock ? "Out of Stock" : "Buy Now"}
              </button>
            </div>
          </div>,
          document.body
        )}
      </Layout>
    </>
  );
};

export default ProductDetails;
