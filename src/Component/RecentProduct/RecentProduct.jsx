import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import thumbnailCard from "../../assets/thumbnail-card.png";

const RecentProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/products");
        if (!response.ok) {
          throw new Error("Failed to load recent products.");
        }

        const data = await response.json();
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const recentProducts = useMemo(() => products.slice(0, 6), [products]);

  return (
    <section className="bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-xl bg-transparent p-1 sm:p-2 lg:p-3">
        <h2 className="py-2 text-center text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          Recent <span className="text-violet-500">Products</span>
        </h2>

        {loading && (
          <div className="flex min-h-56 items-center justify-center">
            <span className="loading loading-spinner loading-lg text-violet-500" />
          </div>
        )}

        {!loading && error && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentProducts.map((product, index) => {
                const title =
                  product?.title ||
                  product?.productName ||
                  product?.name ||
                  `Product ${index + 1}`;
                const image =
                  (product?.image && String(product.image).trim()) ||
                  (product?.imageUrl && String(product.imageUrl).trim()) ||
                  (product?.productImage &&
                    String(product.productImage).trim()) ||
                  thumbnailCard;
                const amount =
                  product?.priceRange ||
                  product?.price ||
                  product?.startingPrice ||
                  "$ 55.99- 75";
                const key = product?._id || product?.id || `${title}-${index}`;

                return (
                  <article
                    key={key}
                    className="rounded-md bg-white p-2 shadow-sm"
                  >
                    <div className="h-44 overflow-hidden rounded bg-slate-200">
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
                    <div className="mt-3">
                      <h3 className="line-clamp-2 text-xl font-semibold text-slate-800">
                        {title}
                      </h3>
                      <p className="mt-1 text-base font-bold text-violet-600">
                        {amount}
                      </p>
                      <button
                        type="button"
                        className="btn mt-3 h-9 w-full rounded border border-violet-300 bg-transparent text-violet-600 shadow-none hover:bg-violet-50"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                to="/allproducts"
                className="btn rounded-md border-0 bg-violet-500 px-8 text-white shadow-none hover:bg-violet-600"
              >
                Show all
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default RecentProduct;
