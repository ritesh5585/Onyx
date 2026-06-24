import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useSelector } from "react-redux";
import Layout from "../../Shared/Layout";

const Home = () => {
  const allProduct = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const navigate = useNavigate();
  console.log(allProduct);

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <Layout showLinks={true}>
      {/* ── Page Header ── */}
      <div className="pt-8 pb-8">
        <h1 className="onyx-page-title">Explore and choose.</h1>
        <div className="onyx-divider" />
      </div>

      {/* ── Product Grid ── */}
      {allProduct && allProduct.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-20 md:pb-24">
          {allProduct.map((product) => {
            const imageUrl =
              product.images?.length > 0 ? product.images[0].url : null;

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[3/4] bg-[#f5f3f0] rounded-md overflow-hidden mb-4">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#999]">
                      No image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-base sm:text-lg leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-[#c49a52] font-['Cormorant_Garamond',serif]">
                    {product.title}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-2 text-[#a09d98]">
                    {product.description}
                  </p>
                  <span className="mt-1 text-[11px] uppercase tracking-[0.2em] font-medium text-[#eee9e1]">
                    {product.price?.currency || "INR"}{" "}
                    {product.price?.amount?.toLocaleString() || "0"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#a09d98]">
            Empty Vault
          </span>
          <p className="max-w-sm text-base md:text-lg leading-relaxed font-['Cormorant_Garamond',serif]">
            No items are currently available in the archive.
          </p>
        </div>
      )}
    </Layout>
  );
};

export default Home;
