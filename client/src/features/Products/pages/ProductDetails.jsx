import React, { useEffect, useState, useMemo } from "react";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { Spinner } from "../../Shared/Spinner";
import Layout from "../../Shared/Layout";
import ImageGallery from "../components/ImageGallery";
import ProductOverview from "../components/ProductOverview";
import { readAttributes } from "../utils/variantUtils";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});

  const detail = useSelector((state) => state.product.details);
  const { handleProductDetails } = useProduct();

  useEffect(() => {
    if (productId) {
      handleProductDetails(productId);
    }
  }, [productId]);

  const parsedVariants = useMemo(() => {
    if (!detail?.variants?.length) return { attributes: {}, variantsList: [] };
    
    const attributes = {};
    const variantsList = detail.variants.map(v => ({
      ...v,
      parsedAttrs: Object.fromEntries(readAttributes(v.attributes))
    }));

    variantsList.forEach(variant => {
      Object.entries(variant.parsedAttrs).forEach(([key, value]) => {
        if (!attributes[key]) attributes[key] = new Set();
        attributes[key].add(value);
      });
    });

    Object.keys(attributes).forEach(key => {
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

  const handleOptionSelect = (attributeName, value) => {
    setSelectedOptions(prev => ({ ...prev, [attributeName]: value }));
    setSelectedImage(0); 
  };

  const resolvedVariant = useMemo(() => {
    if (!parsedVariants.variantsList.length || Object.keys(selectedOptions).length === 0) return null;
    return parsedVariants.variantsList.find(variant => {
      return Object.entries(selectedOptions).every(
        ([key, val]) => variant.parsedAttrs[key] === val
      );
    });
  }, [parsedVariants.variantsList, selectedOptions]);

  if (!detail) {
    return <Spinner />;
  }

  const activeImages = resolvedVariant?.images?.length > 0 ? resolvedVariant.images : detail.images;
  const imageUrls = activeImages?.length > 0 ? activeImages.map((img) => img.url) : ["https://placehold.co/600x800/15151c/eee9e1?text=No+Image"];
  const mainImage = imageUrls[selectedImage] || imageUrls[0];
  const activePrice = resolvedVariant?.price?.amount ? resolvedVariant.price : detail.price;

  let stockStatus = "In Stock";
  let isOutOfStock = false;

  if (detail.variants?.length > 0) {
     if (resolvedVariant) {
        if (resolvedVariant.stock > 0) {
            stockStatus = `${resolvedVariant.stock} In Stock`;
        } else {
            stockStatus = "Out of Stock";
            isOutOfStock = true;
        }
     } else {
        stockStatus = "Variant Unavailable";
        isOutOfStock = true;
     }
  }

  return (
    <Layout showBackButton={true}>
      <div className="py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* ── Image Gallery Component ── */}
          <ImageGallery 
            mainImage={mainImage} 
            imageUrls={imageUrls} 
            selectedImage={selectedImage} 
            setSelectedImage={setSelectedImage} 
            title={detail.title} 
          />

          {/* ── Product Details Section ── */}
          <div className="flex flex-col">
            
            {/* ── Shared Overview Component ── */}
            <ProductOverview 
              title={detail.title}
              priceAmount={activePrice?.amount}
              priceCurrency={activePrice?.currency}
              description={detail.description}
            />

            <div className="flex-grow">
              {/* Dynamic Variants Selection */}
              {Object.keys(parsedVariants.attributes).length > 0 && (
                <div className="mb-8 flex flex-col gap-6">
                  {Object.entries(parsedVariants.attributes).map(([attrName, attrValues]) => (
                    <div key={attrName}>
                      <h3 className="onyx-label mb-3">{attrName}</h3>
                      <div className="flex flex-wrap gap-3">
                        {attrValues.map((val) => {
                          const isSelected = selectedOptions[attrName] === val;
                          return (
                            <button
                              key={val}
                              onClick={() => handleOptionSelect(attrName, val)}
                              className={`px-4 py-2 rounded-lg border transition-colors ${
                                isSelected 
                                  ? "border-[#c49a52] bg-[#c49a52]/10 text-[#c49a52]" 
                                  : "border-[#1f1f1f] bg-[#0f0f13] text-[#eee9e1] hover:border-[#c49a52]/50"
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Extra Details for UI richness */}
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <h3 className="onyx-label">Availability</h3>
                  <p className={`text-sm ${isOutOfStock ? "text-red-400" : "text-[#eee9e1]"}`}>
                    {stockStatus}
                  </p>
                </div>
                <div>
                  <h3 className="onyx-label">Shipping</h3>
                  <p className="text-sm text-[#eee9e1]">Ships in 2-3 days</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-8 border-t border-[#1f1f1f]">
              <button type="button" className={`onyx-btn-secondary sm:flex-1 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isOutOfStock}>
                ADD TO CART
              </button>
              <button type="button" className={`onyx-btn-primary sm:flex-1 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isOutOfStock}>
                BUY NOW
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
