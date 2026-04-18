import React, { use, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contaxts/AuthContexts";

const CATEGORIES = [
  "Art And Hobbies",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Vehicles",
  "Sports",
  "Books",
];

const CreateProduct = () => {
  const { user } = use(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const defaultSellerName = useMemo(
    () => user?.displayName || "",
    [user?.displayName],
  );
  const defaultSellerEmail = useMemo(() => user?.email || "", [user?.email]);
  const defaultSellerImage = useMemo(
    () => user?.photoURL || "",
    [user?.photoURL],
  );

  const handleCreateProduct = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const minPriceRaw = Number(formData.get("minPrice") || 0);
    const maxPriceRaw = Number(formData.get("maxPrice") || minPriceRaw);
    const minPrice = Number.isFinite(minPriceRaw) ? minPriceRaw : 0;
    const maxPrice = Number.isFinite(maxPriceRaw) ? maxPriceRaw : minPrice;

    const productPayload = {
      title: String(formData.get("title") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      minPrice,
      maxPrice,
      priceRange: `$${minPrice} - ${maxPrice}`,
      condition: String(formData.get("condition") || "Brand New").trim(),
      usageTime: String(formData.get("usageTime") || "").trim(),
      image: String(formData.get("image") || "").trim(),
      sellerName: String(formData.get("sellerName") || "").trim(),
      sellerEmail: String(formData.get("sellerEmail") || "").trim(),
      contact: String(formData.get("sellerContact") || "").trim(),
      sellerImage: String(formData.get("sellerImage") || "").trim(),
      location: String(formData.get("location") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      status: "On Sale",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "https://smart-deals-server-flame.vercel.app/products",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(productPayload),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create product. Please try again.");
      }

      setSubmitSuccess("Product created successfully.");
      form.reset();
      form.sellerName.value = defaultSellerName;
      form.sellerEmail.value = defaultSellerEmail;
      form.sellerImage.value = defaultSellerImage;

      setTimeout(() => {
        navigate("/allproducts");
      }, 700);
    } catch (error) {
      setSubmitError(
        error.message || "Failed to create product. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/allproducts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-violet-600"
        >
          <span aria-hidden="true">&larr;</span> Back To Products
        </Link>

        <h1 className="mt-3 text-center text-5xl font-extrabold text-slate-900">
          Create <span className="text-violet-500">A Product</span>
        </h1>

        <form
          onSubmit={handleCreateProduct}
          className="mt-8 rounded-xl bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Title
              </label>
              <input
                name="title"
                required
                type="text"
                placeholder="e.g. Yamaha Fz Guitar for Sale"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Category
              </label>
              <select
                name="category"
                required
                defaultValue=""
                className="select select-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-700"
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Min Price You want to Sale ($)
              </label>
              <input
                name="minPrice"
                required
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 18.5"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Max Price You want to Sale ($)
              </label>
              <input
                name="maxPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Optional (default = Min Price)"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Product Condition
              </label>
              <div className="mt-2 flex items-center gap-6">
                <label className="label cursor-pointer gap-2 p-0">
                  <input
                    type="radio"
                    name="condition"
                    value="Brand New"
                    defaultChecked
                    className="radio radio-sm radio-primary"
                  />
                  <span className="label-text text-sm font-semibold text-slate-700">
                    Brand New
                  </span>
                </label>
                <label className="label cursor-pointer gap-2 p-0">
                  <input
                    type="radio"
                    name="condition"
                    value="Used"
                    className="radio radio-sm radio-primary"
                  />
                  <span className="label-text text-sm font-semibold text-slate-700">
                    Used
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Product Usage time
              </label>
              <input
                name="usageTime"
                required
                type="text"
                placeholder="e.g. 1 year 3 month"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Your Product Image URL
              </label>
              <input
                name="image"
                required
                type="url"
                placeholder="https://..."
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Seller Name
              </label>
              <input
                name="sellerName"
                required
                type="text"
                defaultValue={defaultSellerName}
                placeholder="e.g. Artisan Roasters"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Seller Email
              </label>
              <input
                name="sellerEmail"
                required
                type="email"
                defaultValue={defaultSellerEmail}
                placeholder="your@email.com"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Seller Contact
              </label>
              <input
                name="sellerContact"
                required
                type="text"
                placeholder="e.g. +1-555-1234"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Seller Image URL
              </label>
              <input
                name="sellerImage"
                required
                type="url"
                defaultValue={defaultSellerImage}
                placeholder="https://..."
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                name="location"
                required
                type="text"
                placeholder="City, Country"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Simple Description about your Product
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="e.g. I bought this product 3 month ago..."
                className="textarea textarea-bordered w-full rounded border-slate-200 bg-white text-slate-800"
              />
            </div>
          </div>

          {submitError && (
            <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </p>
          )}

          {submitSuccess && (
            <p className="mt-4 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {submitSuccess}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn mt-5 h-12 w-full border-0 bg-linear-to-r from-violet-600 to-violet-500 text-base font-bold text-white shadow-none hover:from-violet-700 hover:to-violet-600"
          >
            {isSubmitting ? "Creating..." : "Create A Product"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateProduct;
