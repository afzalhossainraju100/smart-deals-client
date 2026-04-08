import React from 'react';
import { NavLink } from 'react-router-dom';
import { use } from 'react';
import { AuthContext } from '../../Contaxts/AuthContexts';

const Navbar = () => {

const {user, signOutUser}=use(AuthContext);
const handleSignOut = () =>{
  signOutUser()
  .then()
  .catch()
}

  const links=<>
    <li><NavLink to="/">Home</NavLink></li>
    <li><NavLink to="/allproducts">All Products</NavLink></li>
    <li><NavLink to="/register">Register</NavLink></li>
    {
      user && <>
      <li><NavLink to="/myproducts">My Product</NavLink></li>
    <li><NavLink to="/mybids">My Bids</NavLink></li>
      </>
    }
  </>
    
    return (
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
              tabIndex="-1"
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
             {links}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">Smart Deals</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {links}
          </ul>
        </div>
        <div className="navbar-end">
          {
            user ? (
              <a className="btn" onClick={handleSignOut}>
                Sign Out, {user.displayName}
              </a>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )
          }
        </div>
      </div>
    );
};

export default Navbar;