import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import thumbnailCard from "../../assets/thumbnail-card.png";

const RecentProduct = () => {
  const products = useLoaderData() || [];
  const recentProducts = Array.isArray(products) ? products.slice(0, 6) : [];

  const getTitle = (product, index) =>
    product?.title ||
    product?.productName ||
    product?.name ||
    `Product ${index + 1}`;

  const getImage = (product) =>
    (product?.image && String(product.image).trim()) ||
    (product?.imageUrl && String(product.imageUrl).trim()) ||
    (product?.productImage && String(product.productImage).trim()) ||
    thumbnailCard;

  const getPrice = (product) =>
    product?.priceRange ||
    product?.price ||
    product?.startingPrice ||
    "$ 55.99- 75";

  return (
    <section className="bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl p-1 sm:p-2 lg:p-3">
        <h2 className="py-2 text-center text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
          Recent <span className="text-violet-500">Products</span>
        </h2>

        {recentProducts.length > 0 ? (
          <>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentProducts.map((product, index) => {
                const title = getTitle(product, index);
                const image = getImage(product);
                const amount = getPrice(product);
                const key = product?._id || product?.id || `${title}-${index}`;
                const id = product?._id || product?.id;

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
                      <Link
                        to={id ? `/products/${id}` : "/allproducts"}
                        className="btn mt-3 h-9 w-full rounded border border-violet-300 bg-transparent text-violet-600 shadow-none hover:bg-violet-50"
                      >
                        View Details
                      </Link>
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
        ) : (
          <p className="mt-8 text-center text-sm text-slate-500">
            No recent products available right now.
          </p>
        )}
      </div>
    </section>
  );
};

export default RecentProduct;
