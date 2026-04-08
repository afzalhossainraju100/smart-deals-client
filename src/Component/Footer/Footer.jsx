import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#021a46] px-4 py-10 text-slate-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 px-2 py-2 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              <span className="text-white">Smart</span>
              <span className="text-violet-400">Deals</span>
            </h3>
            <p className="mt-3 max-w-60 text-sm leading-relaxed text-slate-300">
              Your trusted marketplace for authentic local products. Discover
              the best deals from across Bangladesh.
            </p>
          </div>

          <div>
            <h4 className="text-base font-bold text-white">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>
                <Link to="/allproducts" className="hover:text-violet-300">
                  All Products
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-violet-300">
                  Dashboard
                </a>
              </li>
              <li>
                <Link to="/login" className="hover:text-violet-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-violet-300">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white">Categories</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>Electronics</li>
              <li>Fashion</li>
              <li>Home &amp; Living</li>
              <li>Groceries</li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white">
              Contact &amp; Support
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✉</span>
                <span>support@smartdeals.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✆</span>
                <span>+880 1516503901</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">⌖</span>
                <span>123 Commerce Street, Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold text-white">Social Links</h4>
            <div className="mt-3 flex items-center gap-3">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-6 w-6 items-center justify-center text-white/90 transition hover:text-violet-300"
                aria-label="LinkedIn"
              >
                in
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-6 w-6 items-center justify-center text-white/90 transition hover:text-violet-300"
                aria-label="Instagram"
              >
                g
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-6 w-6 items-center justify-center text-white/90 transition hover:text-violet-300"
                aria-label="Facebook"
              >
                f
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-500/30 px-4 pt-5 text-center text-sm text-slate-300">
          &copy; 2025 SmartDeals. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
