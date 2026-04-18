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
import PrivateRoute from "./Component/Routes/PrivateRoute.jsx";
import CreateProduct from "./Component/CreateProduct/CreateProduct.jsx";
import RouteErrorBoundary from "./Component/RouteErrorBoundary/RouteErrorBoundary.jsx";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const throwRouteError = (message, status = 500) => {
  throw new Response(message, { status });
};

const fetchWithRouteError = async (url, errorMessage) => {
  let response;

  try {
    response = await fetch(url);
  } catch {
    throwRouteError(`${errorMessage} API server is unreachable.`, 503);
  }

  if (!response.ok) {
    throwRouteError(errorMessage, response.status);
  }

  return response;
};

const createJsonLoader =
  (url, errorMessage, fallbackData = null) =>
  async () => {
    try {
      const response = await fetchWithRouteError(url, errorMessage);
      return response.json();
    } catch {
      if (fallbackData !== null) {
        return fallbackData;
      }

      throwRouteError(errorMessage, 500);
    }
  };

const latestProductsLoader = createJsonLoader(
  apiUrl("/latest-products"),
  "Failed to load recent products.",
  [],
);

const allProductsLoader = createJsonLoader(
  apiUrl("/products"),
  "Failed to load products.",
  [],
);

const productDetailsLoader = async ({ params }) => {
  const { id } = params;

  // Try dedicated details endpoint first.
  const detailsResponse = await fetch(apiUrl(`/products/${id}`));
  if (detailsResponse.ok) {
    return detailsResponse.json();
  }

  // Fallback: if API has only list endpoint, resolve details from /products.
  const listResponse = await fetchWithRouteError(
    apiUrl("/products"),
    "Failed to load product details.",
  );

  const products = await listResponse.json();
  const matchedProduct = Array.isArray(products)
    ? products.find(
        (product) => String(product?._id || product?.id) === String(id),
      )
    : null;

  if (!matchedProduct) {
    throwRouteError("Product not found.", 404);
  }

  const bidsResponse = await fetch(apiUrl("/bids"));
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

const myBidsLoader = async () => {
  try {
    const [bidsResponse, productsResponse] = await Promise.all([
      fetch(apiUrl("/bids")),
      fetch(apiUrl("/products")),
    ]);

    if (!bidsResponse.ok || !productsResponse.ok) {
      return {
        bids: [],
        products: [],
      };
    }

    const [bids, products] = await Promise.all([
      bidsResponse.json(),
      productsResponse.json(),
    ]);

    return {
      bids: Array.isArray(bids) ? bids : [],
      products: Array.isArray(products) ? products : [],
    };
  } catch {
    return {
      bids: [],
      products: [],
    };
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <RouteErrorBoundary />,
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
        element: (
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        ),
        loader: productDetailsLoader,
      },
      {
        path: "create-product",
        element: (
          <PrivateRoute>
            <CreateProduct></CreateProduct>
          </PrivateRoute>
        ),
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
        loader: allProductsLoader,
        element: (
          <PrivateRoute>
            <MyProducts></MyProducts>
          </PrivateRoute>
        ),
      },
      {
        path: "mybids",
        loader: myBidsLoader,
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
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
