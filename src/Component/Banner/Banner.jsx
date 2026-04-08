import React from "react";
import bgHeroLeft from "../../assets/bg-hero-left.png";
import bgHeroRight from "../../assets/bg-hero-right.png";

const Banner = () => {
  return (
    <section className="relative isolate overflow-hidden bg-linear-to-r from-[#f4ebff] via-[#eef2ff] to-[#e7faf0] px-4 py-14 sm:px-6 lg:px-8">
      <img
        src={bgHeroLeft}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full max-h-105 w-auto opacity-60"
      />
      <img
        src={bgHeroRight}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-full max-h-105 w-auto opacity-60"
      />
      <div className="pointer-events-none absolute inset-0 bg-white/10" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 text-center sm:px-8 lg:px-12">
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight text-slate-800 sm:text-5xl lg:text-6xl">
          Deal Your <span className="text-violet-500">Products</span>
          <br />
          In A <span className="text-violet-500">Smart</span> Way !
        </h1>

        <p className="mx-auto mt-5 max-w-3xl text-base text-slate-600 sm:text-xl">
          SmartDeals helps you sell, resell, and shop from trusted local sellers
          all in one place!
        </p>

        <form className="mx-auto mt-8 flex w-full max-w-xl items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-[0_8px_30px_rgba(30,41,59,0.08)]">
          <input
            type="text"
            placeholder="search For Products, Categories..."
            className="h-12 w-full bg-transparent px-5 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            className="flex h-12 w-14 items-center justify-center bg-violet-500 text-white transition hover:bg-violet-600"
            aria-label="Search products"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </form>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button className="btn rounded-md border-0 bg-violet-500 px-6 text-white shadow-none hover:bg-violet-600">
            Watch All Products
          </button>
          <button className="btn rounded-md border border-violet-500 bg-transparent px-6 text-violet-600 shadow-none hover:bg-violet-50">
            Post an Product
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
