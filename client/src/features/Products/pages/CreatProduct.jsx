import { useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import ImageUpload from "../components/imageUpload";
import Price from "../components/Price";
import Layout from "../../Shared/Layout";

const MAX_IMAGES = 7;
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const INITIAL_FORM = {
  title: "",
  description: "",
  priceAmount: "",
  priceCurrency: "INR",
};

const CreatProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = useProduct();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const addFiles = useCallback((files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setImages((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
  }, []);

  const handleImageChange = useCallback(
    (e) => {
      addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles],
  );

  const removeImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images.length) return alert("Upload at least one image");

    setIsSubmitting(true);
    try {
      const data = new FormData();

      Object.entries(formData).forEach(([k, v]) => data.append(k, v));

      images.forEach((file) => data.append("images", file));

      handleCreateProduct(data);

      navigate("/");
    } catch (err) {
      console.error("Create product failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout showBackButton={true}>
      <div className="max-w-[1100px] mx-auto py-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="onyx-page-title">New Listing</h1>
          <div className="onyx-divider" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 items-start">
            {/* LEFT */}
            <div className="flex flex-col gap-8">
              <div>
                <label className="onyx-label">Product Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Oversized Casual Shirt"
                  required
                  className="onyx-input"
                />
              </div>

              <div>
                <label className="onyx-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the product — material, fit, details..."
                  rows={6}
                  className="onyx-textarea"
                />
              </div>

              <Price
                formData={formData}
                handleChange={handleChange}
                CURRENCIES={CURRENCIES}
              />
            </div>

            {/* RIGHT */}
            <div>
              <ImageUpload
                images={images}
                MAX_IMAGES={MAX_IMAGES}
                isDragging={isDragging}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragLeave={handleDragLeave}
                handleImageChange={handleImageChange}
                removeImage={removeImage}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreatProduct;
