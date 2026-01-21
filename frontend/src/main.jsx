import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router-dom";
import route from "./Route/Route.jsx";
import Context from "./Context/Context.jsx";
import { Provider } from "react-redux";
import { persistor, store } from "./Service/Redux/Store.js";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Context>
          <RouterProvider router={route}>
            <App />
          </RouterProvider>
        </Context>
      </PersistGate>
    </Provider>
  </StrictMode>
);
