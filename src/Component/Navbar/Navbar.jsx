import React from "react";
import { NavLink } from "react-router-dom";
import { use } from "react";
import { AuthContext } from "../../Contaxts/AuthContexts";

const Navbar = () => {
  const { user, signOutUser } = use(AuthContext);
  const handleSignOut = () => {
    signOutUser().then().catch();
  };

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
      isActive
        ? "bg-violet-100 text-violet-700"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const links = (
    <>
      <li>
        <NavLink className={navLinkClass} to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink className={navLinkClass} to="/allproducts">
          All Products
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink className={navLinkClass} to="/myproducts">
              My Products
            </NavLink>
          </li>
          <li>
            <NavLink className={navLinkClass} to="/mybids">
              My Bids
            </NavLink>
          </li>
          <li>
            <NavLink className={navLinkClass} to="/myproducts">
              Create Product
            </NavLink>
          </li>
        </>
      )}
      {!user && (
        <li>
          <NavLink className={navLinkClass} to="/register">
            Register
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar border-b border-slate-200 bg-white/95 px-3 shadow-sm backdrop-blur md:px-6">
      <div className="navbar-start gap-2">
        <div className="dropdown">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content z-[1] mt-3 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
          >
            {links}
            {user && (
              <li>
                <button
                  onClick={handleSignOut}
                  className="text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </li>
            )}
          </ul>
        </div>
        <a className="btn btn-ghost text-3xl font-extrabold tracking-tight normal-case">
          <span className="text-slate-900">Smart</span>
          <span className="text-violet-500">Deals</span>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal items-center gap-1 px-1">
          {links}
        </ul>
      </div>
      <div className="navbar-end gap-2">
        {user ? (
          <div className="flex items-center gap-2">
            <p className="hidden text-sm font-semibold text-slate-700 sm:block">
              {user.displayName || user.email?.split("@")[0] || "User"}
            </p>
            <button
              onClick={handleSignOut}
              className="btn btn-sm rounded-full border-0 bg-rose-500 text-white hover:bg-rose-600"
            >
              Sign Out
            </button>
            <div
              className="avatar"
              title={user.displayName || user.email || "User"}
            >
              <div className="w-11 rounded-full ring ring-violet-200 ring-offset-2 ring-offset-base-100">
                <img
                  src={user.photoURL || "https://i.ibb.co/X8xQ4Fh/avatar.png"}
                  alt={user.displayName || "User"}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <NavLink
              className="btn btn-sm rounded-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              to="/login"
            >
              Login
            </NavLink>
            <NavLink
              className="btn btn-sm rounded-full border-0 bg-violet-500 text-white hover:bg-violet-600"
              to="/register"
            >
              Register
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
