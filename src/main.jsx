import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Root from '../src/Component/Layout/Root.jsx';
import Home from '../src/Component/Home/Home.jsx';
import AllProduct from '../src/Component/AllProduct/AllProduct.jsx';
import Register from '../src/Component/Register/Register.jsx';
import Login from '../src/Component/Login/Login.jsx';
import AuthProvider from './Contaxts/AuthProvider.jsx';
import MyProducts from './Component/MyProducts/MyProducts.jsx';
import MyBids from './Component/MyBids/MyBids.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path:'allproducts',
        Component: AllProduct,
      },
      {
        path:'register',
        Component: Register
      },
      {
        path:'login',
        Component: Login
      },
      {
        path:'myproducts',
        element: <MyProducts></MyProducts>
      },
      {
        path:'mybids',
        elemet: <MyBids></MyBids>
      }
    ]
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />,
    </AuthProvider>
  </StrictMode>,
);
