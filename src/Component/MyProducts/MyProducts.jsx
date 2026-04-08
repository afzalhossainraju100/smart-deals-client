import React, { use, useEffect, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { AuthContext } from "../../Contaxts/AuthContexts";
import {
  PRODUCTS_API_URL,
  deleteProduct,
  getProductId,
  patchProduct,
} from "../../utils/productUtils";
import thumbnailCard from "../../assets/thumbnail-card.png";

const normalizeEmail = (email) => String(email || "").toLowerCase();

const MyProducts = () => {
  const { user } = use(AuthContext);
  const loaderProducts = useLoaderData();
  const products = useMemo(
    () => (Array.isArray(loaderProducts) ? loaderProducts : []),
    [loaderProducts],
  );
  const [productRows, setProductRows] = useState([]);
  const [updatingProductId, setUpdatingProductId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  const ownerProducts = useMemo(() => {
    const currentUserEmail = normalizeEmail(user?.email);

    if (!currentUserEmail || !Array.isArray(products)) {
      return [];
    }

    return products.filter((product) => {
      const sellerEmail = normalizeEmail(
        product?.sellerEmail || product?.seller?.email,
      );
      return currentUserEmail === sellerEmail;
    });
  }, [products, user?.email]);

  useEffect(() => {
    setProductRows(ownerProducts);
  }, [ownerProducts]);

  const handleDelete = async (product) => {
    const productId = getProductId(product);
    if (!productId) {
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");
    setUpdatingProductId(String(productId));
    const previousRows = productRows;
    setProductRows((prev) =>
      prev.filter((row) => String(getProductId(row)) !== String(productId)),
    );

    try {
      await deleteProduct(productId);
    } catch (error) {
      setProductRows(previousRows);
      setErrorMessage(error.message || "Failed to delete product.");
    } finally {
      setUpdatingProductId("");
    }
  };

  const handleMakeSold = async (product) => {
    const productId = getProductId(product);
    if (!productId) {
      return;
    }

    setErrorMessage("");
    setUpdatingProductId(String(productId));
    const previousRows = productRows;
    setProductRows((prev) =>
      prev.map((row) =>
        String(getProductId(row)) === String(productId)
          ? { ...row, status: "Sold" }
          : row,
      ),
    );

    try {
      await patchProduct(productId, { status: "Sold" });
    } catch (error) {
      setProductRows(previousRows);
      setErrorMessage(error.message || "Failed to mark product as sold.");
    } finally {
      setUpdatingProductId("");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({
      ...product,
      minPrice: product?.minPrice || "",
      maxPrice: product?.maxPrice || "",
      location: product?.location || "",
      usageTime: product?.usageTime || "",
    });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingProduct) {
      return;
    }

    const productId = getProductId(editingProduct);
    if (!productId) {
      return;
    }

    const minPrice = Number(editingProduct.minPrice || 0);
    const maxPrice = Number(editingProduct.maxPrice || minPrice);

    const payload = {
      title: String(editingProduct.title || "").trim(),
      minPrice,
      maxPrice,
      priceRange: `$${minPrice} - ${maxPrice}`,
      usageTime: String(editingProduct.usageTime || "").trim(),
      location: String(editingProduct.location || "").trim(),
    };

    setErrorMessage("");
    setUpdatingProductId(String(productId));
    const previousRows = productRows;
    setProductRows((prev) =>
      prev.map((row) =>
        String(getProductId(row)) === String(productId)
          ? { ...row, ...payload }
          : row,
      ),
    );

    try {
      await patchProduct(productId, payload);
      setEditingProduct(null);
    } catch (error) {
      setProductRows(previousRows);
      setErrorMessage(error.message || "Failed to update product.");
    } finally {
      setUpdatingProductId("");
    }
  };

  return (
    <section className="bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-5xl font-extrabold text-slate-900">
          My Products:{" "}
          <span className="text-violet-500">{productRows.length}</span>
        </h1>

        <div className="mt-6 overflow-hidden rounded-md bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th>SL No</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productRows.length > 0 ? (
                  productRows.map((product, index) => {
                    const productId = getProductId(product);
                    const title =
                      product?.title ||
                      product?.productName ||
                      product?.name ||
                      `Product ${index + 1}`;
                    const price =
                      product?.priceRange ||
                      product?.price ||
                      (product?.minPrice && product?.maxPrice
                        ? `$${product.minPrice} - ${product.maxPrice}`
                        : "$0");
                    const status = product?.status || "On Sale";
                    const image =
                      (product?.image && String(product.image).trim()) ||
                      (product?.imageUrl && String(product.imageUrl).trim()) ||
                      (product?.productImage &&
                        String(product.productImage).trim()) ||
                      thumbnailCard;
                    const isUpdating = updatingProductId === String(productId);

                    return (
                      <tr key={String(productId) || `${title}-${index}`}>
                        <td className="font-semibold text-slate-700">
                          {index + 1}
                        </td>
                        <td>
                          <Link
                            to={productId ? `/products/${productId}` : "/allproducts"}
                            className="group flex items-center gap-3 rounded p-1 transition hover:bg-slate-50"
                          >
                            <div className="h-10 w-10 overflow-hidden rounded bg-slate-200">
                              <img
                                src={image}
                                alt={title}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src = thumbnailCard;
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 group-hover:text-violet-600">
                                {title}
                              </p>
                              <p className="text-xs text-slate-500">
                                {product?.location || "No location"}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="font-bold text-slate-700">{price}</td>
                        <td>
                          <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-900">
                            {status}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-xs rounded border border-sky-500 bg-transparent text-sky-600 shadow-none hover:bg-sky-50"
                              onClick={() => openEditModal(product)}
                              disabled={isUpdating}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs rounded border border-rose-500 bg-transparent text-rose-600 shadow-none hover:bg-rose-50"
                              onClick={() => handleDelete(product)}
                              disabled={isUpdating}
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              className="btn btn-xs rounded border border-emerald-500 bg-transparent text-emerald-600 shadow-none hover:bg-emerald-50"
                              onClick={() => handleMakeSold(product)}
                              disabled={isUpdating || status === "Sold"}
                            >
                              Make Sold
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      You have not posted any products yet.{" "}
                      <Link
                        to="/create-product"
                        className="font-semibold text-violet-600"
                      >
                        Create Product
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {errorMessage && (
          <p className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorMessage}
          </p>
        )}
      </div>

      {editingProduct && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/45 px-4"
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="w-full max-w-xl rounded-xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-3xl font-extrabold text-slate-900">
              Edit Product
            </h2>

            <form className="mt-5 space-y-3" onSubmit={handleEditSubmit}>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Title
                </label>
                <input
                  name="title"
                  required
                  value={editingProduct.title || ""}
                  onChange={handleEditChange}
                  className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Min Price
                  </label>
                  <input
                    name="minPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={editingProduct.minPrice}
                    onChange={handleEditChange}
                    className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Max Price
                  </label>
                  <input
                    name="maxPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={editingProduct.maxPrice}
                    onChange={handleEditChange}
                    className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Usage Time
                  </label>
                  <input
                    name="usageTime"
                    required
                    value={editingProduct.usageTime}
                    onChange={handleEditChange}
                    className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Location
                  </label>
                  <input
                    name="location"
                    required
                    value={editingProduct.location}
                    onChange={handleEditChange}
                    className="input input-bordered h-11 w-full rounded border-slate-200 bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="btn rounded border border-violet-400 bg-white px-6 text-violet-600 shadow-none hover:bg-violet-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn rounded border-0 bg-violet-500 px-7 text-white shadow-none hover:bg-violet-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyProducts;
