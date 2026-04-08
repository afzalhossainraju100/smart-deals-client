import React from "react";
import { Link } from "react-router-dom";
import thumbnailCard from "../../assets/thumbnail-card.png";

const Details = ({ product }) => {
  const title =
    product?.title || product?.productName || product?.name || "Product";
  const category = product?.category || "Art And Hobbies";
  const image =
    (product?.image && String(product.image).trim()) ||
    (product?.imageUrl && String(product.imageUrl).trim()) ||
    (product?.productImage && String(product.productImage).trim()) ||
    thumbnailCard;

  const priceText =
    product?.priceRange ||
    (product?.minPrice && product?.maxPrice
      ? `$${product.minPrice} - ${product.maxPrice}`
      : product?.price
        ? `$${product.price}`
        : "$22.5 - 30");

  const productId = product?._id || product?.id || "N/A";
  const postedDate = product?.postedDate || product?.createdAt || "10/19/2024";
  const description =
    product?.description ||
    "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using lorem ipsum is that it has a more-or-less normal distribution of letters.";
  const condition = product?.condition || "New";
  const usageTime = product?.usageTime || "3 Month";

  const sellerName =
    product?.sellerName ||
    product?.seller?.name ||
    product?.userName ||
    "Sara Chen";
  const sellerEmail =
    product?.sellerEmail ||
    product?.seller?.email ||
    "sara.rfs_by_brandshop.net";
  const location =
    product?.location || product?.seller?.location || "Los Angeles, CA";
  const contact =
    product?.contact || product?.seller?.contact || "sara.chen_contact";
  const status = product?.status || "On Sale";

  return (
    <section className="bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="h-87.5 overflow-hidden rounded-md bg-slate-300">
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

          <article className="rounded-md bg-white p-4 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-800">
              Product Description
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-6 border-b border-slate-200 pb-3 text-base">
              <p>
                <span className="font-semibold text-violet-600">
                  Condition :
                </span>{" "}
                <span className="font-semibold text-slate-800">
                  {condition}
                </span>
              </p>
              <p>
                <span className="font-semibold text-violet-600">
                  Usage Time :
                </span>{" "}
                <span className="font-semibold text-slate-800">
                  {usageTime}
                </span>
              </p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              {description}
            </p>
          </article>
        </div>

        <div className="space-y-4">
          <Link
            to="/allproducts"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-violet-600"
          >
            <span aria-hidden="true">&larr;</span> Back To Products
          </Link>

          <h1 className="text-5xl font-extrabold leading-tight text-slate-900">
            {title}
          </h1>

          <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
            {category}
          </span>

          <article className="rounded-md bg-white p-4 shadow-sm">
            <p className="text-4xl font-extrabold text-emerald-500">
              {priceText}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Price starts from
            </p>
          </article>

          <article className="rounded-md bg-white p-4 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-800">
              Product Details
            </h2>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>
                <span className="font-bold text-slate-800">Product ID:</span>{" "}
                {productId}
              </p>
              <p>
                <span className="font-bold text-slate-800">Posted:</span>{" "}
                {postedDate}
              </p>
            </div>
          </article>

          <article className="rounded-md bg-white p-4 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-800">
              Seller Information
            </h2>

            <div className="mt-4 flex items-start gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-300" />
              <div>
                <p className="font-semibold text-slate-800">{sellerName}</p>
                <p className="text-sm text-slate-500">{sellerEmail}</p>
              </div>
            </div>

            <div className="mt-4 space-y-1 text-sm text-slate-600">
              <p>
                <span className="font-bold text-slate-800">Location:</span>{" "}
                {location}
              </p>
              <p>
                <span className="font-bold text-slate-800">Contact:</span>{" "}
                {contact}
              </p>
              <p>
                <span className="font-bold text-slate-800">Status:</span>{" "}
                <span className="inline-flex rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-900">
                  {status}
                </span>
              </p>
            </div>
          </article>

          <button className="btn h-12 w-full border-0 bg-linear-to-r from-violet-600 to-violet-500 text-lg font-bold text-white shadow-none hover:from-violet-700 hover:to-violet-600">
            I Want Buy This Product
          </button>
        </div>
      </div>
    </section>
  );
};

export default Details;
