import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Root from "../src/Component/Layout/Root.jsx";
import Home from "../src/Component/Home/Home.jsx";
import AllProduct from "../src/Component/AllProduct/AllProduct.jsx";
import ProductDetails from "../src/Component/ProductDetails/ProductDetails.jsx";
import Register from "../src/Component/Register/Register.jsx";
import Login from "../src/Component/Login/Login.jsx";
import AuthProvider from "./Contaxts/AuthProvider.jsx";
import MyProducts from "./Component/MyProducts/MyProducts.jsx";
import MyBids from "./Component/MyBids/MyBids.jsx";
import PrivateRoute from "./Component/PrivateRoute/PrivateRoute.jsx";

const createJsonLoader = (url, errorMessage) => async () => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Response(errorMessage, { status: response.status });
  }

  return response.json();
};

const latestProductsLoader = createJsonLoader(
  "http://localhost:3000/latest-products",
  "Failed to load recent products.",
);

const allProductsLoader = createJsonLoader(
  "http://localhost:3000/products",
  "Failed to load products.",
);

const productDetailsLoader = async ({ params }) => {
  const { id } = params;

  // Try dedicated details endpoint first.
  const detailsResponse = await fetch(`http://localhost:3000/products/${id}`);
  if (detailsResponse.ok) {
    return detailsResponse.json();
  }

  // Fallback: if API has only list endpoint, resolve details from /products.
  const listResponse = await fetch("http://localhost:3000/products");
  if (!listResponse.ok) {
    throw new Response("Failed to load product details.", {
      status: listResponse.status,
    });
  }

  const products = await listResponse.json();
  const matchedProduct = Array.isArray(products)
    ? products.find(
        (product) => String(product?._id || product?.id) === String(id),
      )
    : null;

  if (!matchedProduct) {
    throw new Response("Product not found.", { status: 404 });
  }

  const bidsResponse = await fetch("http://localhost:3000/bids");
  const bidsData = bidsResponse.ok ? await bidsResponse.json() : [];

  const productTitle =
    matchedProduct?.title ||
    matchedProduct?.productName ||
    matchedProduct?.name;

  const productBids = Array.isArray(bidsData)
    ? bidsData.filter((bid) => {
        const bidProductId =
          bid?.productId ||
          bid?.product_id ||
          bid?.productID ||
          bid?.itemId ||
          bid?.product?._id ||
          bid?.product?.id;

        const bidTitle =
          bid?.productTitle ||
          bid?.productName ||
          bid?.title ||
          bid?.product?.title;

        return (
          String(bidProductId) === String(id) ||
          (productTitle && String(bidTitle) === String(productTitle))
        );
      })
    : [];

  return {
    product: matchedProduct,
    bids: productBids,
  };
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
        loader: latestProductsLoader,
      },
      {
        path: "allproducts",
        Component: AllProduct,
        loader: allProductsLoader,
      },
      {
        path: "products/:id",
        Component: ProductDetails,
        loader: productDetailsLoader,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "myproducts",
        element: (
          <PrivateRoute>
            <MyProducts></MyProducts>
          </PrivateRoute>
        ),
      },
      {
        path: "mybids",
        element: (
          <PrivateRoute>
            <MyBids></MyBids>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />,
    </AuthProvider>
  </StrictMode>,
);
