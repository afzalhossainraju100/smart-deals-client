export const BIDS_API_URL = "https://smart-deals-server-flame.vercel.app/bids";

export const getEntityId = (entity) => entity?._id || entity?.id || "";

export const normalizeEmail = (email) => String(email || "").toLowerCase();

export const isSameEmail = (a, b) =>
  Boolean(normalizeEmail(a) && normalizeEmail(a) === normalizeEmail(b));

export const createBidPayload = ({ product, formData }) => ({
  productId: getEntityId(product),
  productTitle: product?.title || product?.productName || product?.name,
  sellerName: product?.sellerName || product?.seller?.name,
  sellerEmail: product?.sellerEmail || product?.seller?.email,
  buyerName: formData.buyerName,
  buyerEmail: formData.buyerEmail,
  buyerImage: formData.buyerImage,
  amount: formData.offeredPrice,
  contact: formData.contactInfo,
  status: "Pending",
  createdAt: new Date().toISOString(),
});

export const postBid = async (payload) => {
  const response = await fetch(BIDS_API_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to submit bid. Please try again.");
  }

  return response.json();
};

export const patchBidStatus = async (bidId, status) => {
  const response = await fetch(`${BIDS_API_URL}/${bidId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update bid status.");
  }
};

export const removeBid = async (bidId) => {
  const response = await fetch(`${BIDS_API_URL}/${bidId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete bid.");
  }
};
