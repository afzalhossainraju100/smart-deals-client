import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import thumbnailCard from "../../assets/thumbnail-card.png";

const AllProduct = () => {
  const products = useLoaderData() || [];

  return (
    <section className="bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
          All <span className="text-violet-500">Products</span>
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => {
            const title =
              product?.title ||
              product?.productName ||
              product?.name ||
              `Product ${index + 1}`;
            const image =
              (product?.image && String(product.image).trim()) ||
              (product?.imageUrl && String(product.imageUrl).trim()) ||
              (product?.productImage && String(product.productImage).trim()) ||
              thumbnailCard;
            const amount =
              product?.priceRange ||
              product?.price ||
              product?.startingPrice ||
              "$ 55.99- 75";
            const id = product?._id || product?.id;
            const key = id || `${title}-${index}`;

            return (
              <article key={key} className="rounded-lg bg-white p-2 shadow-sm">
                <div className="h-40 overflow-hidden rounded-md bg-slate-200 sm:h-44">
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

                <div className="px-1 py-3">
                  <span className="inline-block rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600">
                    Hot Deal
                  </span>

                  <h2 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-800 sm:text-base">
                    {title}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-violet-600">
                    {amount}
                  </p>

                  <Link
                    to={id ? `/products/${id}` : "/allproducts"}
                    className="btn mt-3 h-8 w-full rounded border border-violet-300 bg-transparent text-[11px] font-medium text-violet-600 shadow-none hover:bg-violet-50"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AllProduct;
