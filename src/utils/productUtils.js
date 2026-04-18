export const PRODUCTS_API_URL =
  "https://smart-deals-server-flame.vercel.app/products";

export const getProductId = (product) => product?._id || product?.id || "";

export const patchProduct = async (productId, payload) => {
  const response = await fetch(`${PRODUCTS_API_URL}/${productId}`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update product.");
  }

  return response.json();
};

export const deleteProduct = async (productId) => {
  const response = await fetch(`${PRODUCTS_API_URL}/${productId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product.");
  }

  return response.json();
};
