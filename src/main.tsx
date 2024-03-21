import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import { PokemonList } from "./components/PokemonList/PokemonList";
import { PokemonDetails } from "./components/PokemonDetails/PokemonDetails";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<PokemonList />}>
        <Route path="/:searchTerm" element={<PokemonList />} />
      </Route>
      <Route path="/pokemon/:name" element={<PokemonDetails />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
