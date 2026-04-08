import React, { use, useEffect, useState } from "react";
import { AuthContext } from "../../Contaxts/AuthContexts";
import { createBidPayload, getEntityId, postBid } from "../../utils/bidUtils";

const INITIAL_FORM_DATA = {
  buyerName: "",
  buyerEmail: "",
  buyerImage: "",
  offeredPrice: "",
  contactInfo: "",
};

const Modal = ({ isOpen, onClose, product, onBidPlaced }) => {
  const { user } = use(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    if (isOpen) {
      setSubmitError("");
      setFormData((prev) => ({
        ...prev,
        buyerName: user?.displayName || prev.buyerName || "",
        buyerEmail: user?.email || prev.buyerEmail || "",
        buyerImage: user?.photoURL || prev.buyerImage || "",
      }));
    }
  }, [isOpen, user]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const payload = createBidPayload({ product, formData });

    try {
      const data = await postBid(payload);
      const optimisticBid = {
        ...payload,
        _id:
          data?.insertedId || data?._id || getEntityId(data) || `${Date.now()}`,
      };

      if (onBidPlaced) {
        onBidPlaced(optimisticBid);
      }

      onClose();
    } catch (error) {
      setSubmitError(
        error.message || "Failed to submit bid. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/45 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-center text-4xl font-extrabold text-slate-900">
          Give Seller Your Offered Price
        </h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Buyer Name
              </label>
              <input
                required
                type="text"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                placeholder="Your name"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">
                Buyer Email
              </label>
              <input
                required
                type="email"
                name="buyerEmail"
                value={formData.buyerEmail}
                onChange={handleChange}
                placeholder="Your Email"
                className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Buyer Image URL
            </label>
            <input
              required
              type="url"
              name="buyerImage"
              value={formData.buyerImage}
              onChange={handleChange}
              placeholder="https://...your_img_url"
              className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Place your Price
            </label>
            <input
              required
              type="text"
              name="offeredPrice"
              value={formData.offeredPrice}
              onChange={handleChange}
              placeholder="e.g. Artisan Roasters"
              className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Contact Info
            </label>
            <input
              required
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="e.g. +1-555-1234"
              className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {submitError && (
            <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn rounded border border-violet-400 bg-white px-6 text-violet-600 shadow-none hover:bg-violet-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn rounded border-0 bg-violet-500 px-7 text-white shadow-none hover:bg-violet-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Bid"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
