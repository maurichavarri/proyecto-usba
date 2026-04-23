import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import Cate from "./cate";

// 👉 IMPORTA LAS PÁGINAS REALES (aunque tus compañeros aún no las hagan)
import Equipos from "./equipos";
import Fixture from "./fixture";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* redirección inicial */}
        <Route path="/" element={<Navigate to="/torneos" />} />

        {/* vista principal */}
        <Route path="/torneos" element={<Cate />} />

        {/* rutas dinámicas (LISTAS PARA TU COMPAÑERO) */}
        <Route path="/torneos/:categoria/equipos" element={<Equipos />} />
        <Route path="/torneos/:categoria/fixture" element={<Fixture />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

