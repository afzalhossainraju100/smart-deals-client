import React, { use, useEffect, useMemo, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { AuthContext } from "../../Contaxts/AuthContexts";
import { getEntityId, normalizeEmail, removeBid } from "../../utils/bidUtils";
import thumbnailCard from "../../assets/thumbnail-card.png";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "https://smart-deals-server-flame.vercel.app";

const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const getAuthToken = async (currentUser) => {
  if (!currentUser) {
    return "";
  }

  if (typeof currentUser.getIdToken === "function") {
    return currentUser.getIdToken();
  }

  return currentUser.accessToken || "";
};

const MyBids = () => {
  const { user } = use(AuthContext);
  const loaderData = useLoaderData();
  const initialProducts = useMemo(
    () => (Array.isArray(loaderData?.products) ? loaderData.products : []),
    [loaderData?.products],
  );
  const initialBids = useMemo(
    () => (Array.isArray(loaderData?.bids) ? loaderData.bids : []),
    [loaderData?.bids],
  );
  const [bidRows, setBidRows] = useState(initialBids);
  const [productRows, setProductRows] = useState(initialProducts);
  const [deletingBidId, setDeletingBidId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setBidRows(initialBids);
    setProductRows(initialProducts);
  }, [initialBids, initialProducts]);

  useEffect(() => {
    let isDisposed = false;

    const fetchMyBidsWithToken = async () => {
      if (!user) {
        return;
      }

      try {
        const token = await getAuthToken(user);

        if (!token) {
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [bidsResponse, productsResponse] = await Promise.all([
          fetch(apiUrl("/bids"), { headers }),
          fetch(apiUrl("/products"), { headers }),
        ]);

        if (!bidsResponse.ok || !productsResponse.ok) {
          throw new Error("Failed to load bids with authorization.");
        }

        const [bidsData, productsData] = await Promise.all([
          bidsResponse.json(),
          productsResponse.json(),
        ]);

        if (isDisposed) {
          return;
        }

        setBidRows(Array.isArray(bidsData) ? bidsData : []);
        setProductRows(Array.isArray(productsData) ? productsData : []);
      } catch (error) {
        if (!isDisposed) {
          setErrorMessage(error.message || "Failed to load bids.");
        }
      }
    };

    fetchMyBidsWithToken();

    return () => {
      isDisposed = true;
    };
  }, [user]);

  const myBids = useMemo(() => {
    const currentUserEmail = normalizeEmail(user?.email);
    return bidRows.filter((bid) => {
      const bidUserEmail = normalizeEmail(
        bid?.buyerEmail || bid?.email || bid?.buyer?.email,
      );
      return Boolean(currentUserEmail && bidUserEmail === currentUserEmail);
    });
  }, [bidRows, user?.email]);

  const productById = useMemo(() => {
    const map = new Map();
    productRows.forEach((product) => {
      const id = String(getEntityId(product));
      if (id) {
        map.set(id, product);
      }
    });
    return map;
  }, [productRows]);

  const findRelatedProduct = (bid) => {
    const bidProductId =
      bid?.productId || bid?.product_id || bid?.productID || bid?.itemId;

    if (bidProductId && productById.has(String(bidProductId))) {
      return productById.get(String(bidProductId));
    }

    const bidTitle = bid?.productTitle || bid?.productName || bid?.title;
    if (!bidTitle) {
      return null;
    }

    return (
      productRows.find((product) => {
        const productTitle =
          product?.title || product?.productName || product?.name;
        return String(productTitle) === String(bidTitle);
      }) || null
    );
  };

  const handleRemoveBid = async (bid) => {
    const bidId = getEntityId(bid);
    if (!bidId) {
      return;
    }

    setErrorMessage("");
    setDeletingBidId(String(bidId));
    const previousRows = bidRows;
    setBidRows((prev) =>
      prev.filter((row) => String(getEntityId(row)) !== String(bidId)),
    );

    try {
      await removeBid(bidId);
    } catch (error) {
      setBidRows(previousRows);
      setErrorMessage(error.message || "Failed to remove bid.");
    } finally {
      setDeletingBidId("");
    }
  };

  return (
    <section className="bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-5xl font-extrabold text-slate-900">
          My Bids: <span className="text-violet-500">{myBids.length}</span>
        </h1>

        <div className="mt-6 overflow-hidden rounded-md bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th>SL No</th>
                  <th>Product</th>
                  <th>Seller</th>
                  <th>Bid Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myBids.length > 0 ? (
                  myBids.map((bid, index) => {
                    const bidId = String(getEntityId(bid));
                    const relatedProduct = findRelatedProduct(bid);
                    const productId = getEntityId(relatedProduct);
                    const productTitle =
                      bid?.productTitle ||
                      bid?.productName ||
                      bid?.title ||
                      relatedProduct?.title ||
                      relatedProduct?.productName ||
                      relatedProduct?.name ||
                      "Product";
                    const productPrice =
                      relatedProduct?.priceRange ||
                      relatedProduct?.price ||
                      "$22.5";
                    const sellerName =
                      bid?.sellerName ||
                      relatedProduct?.sellerName ||
                      relatedProduct?.seller?.name ||
                      "Seller";
                    const sellerEmail =
                      bid?.sellerEmail ||
                      relatedProduct?.sellerEmail ||
                      relatedProduct?.seller?.email ||
                      "N/A";
                    const bidPrice =
                      bid?.bidAmount || bid?.amount || bid?.price || "$0";
                    const bidStatus = bid?.status || "Pending";
                    const productImage =
                      (relatedProduct?.image &&
                        String(relatedProduct.image).trim()) ||
                      (relatedProduct?.imageUrl &&
                        String(relatedProduct.imageUrl).trim()) ||
                      (relatedProduct?.productImage &&
                        String(relatedProduct.productImage).trim()) ||
                      thumbnailCard;

                    return (
                      <tr key={bidId || `${productTitle}-${index}`}>
                        <td className="font-semibold text-slate-700">
                          {index + 1}
                        </td>
                        <td>
                          <Link
                            to={
                              productId
                                ? `/products/${productId}`
                                : "/allproducts"
                            }
                            className="group flex items-center gap-2 rounded p-1 transition hover:bg-slate-50"
                          >
                            <div className="h-10 w-10 overflow-hidden rounded bg-slate-200">
                              <img
                                src={productImage}
                                alt={productTitle}
                                className="h-full w-full object-cover"
                                onError={(event) => {
                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src = thumbnailCard;
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 group-hover:text-violet-600">
                                {productTitle}
                              </p>
                              <p className="text-xs text-slate-500">
                                {productPrice}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {sellerName}
                            </p>
                            <p className="text-xs text-slate-500">
                              {sellerEmail}
                            </p>
                          </div>
                        </td>
                        <td className="font-bold text-slate-700">{bidPrice}</td>
                        <td>
                          <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-900">
                            {bidStatus}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-xs rounded border border-rose-500 bg-transparent text-rose-600 shadow-none hover:bg-rose-50"
                            onClick={() => handleRemoveBid(bid)}
                            disabled={deletingBidId === bidId}
                          >
                            Remove Bid
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      You have not participated in any bids yet.
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
    </section>
  );
};

export default MyBids;
