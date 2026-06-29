import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cate.css";

const categorias = [
  { id: 1, nombre: "Categoría +30", edad: "Mayores de 30 años", min: 30 },
  { id: 2, nombre: "Categoría +35", edad: "Mayores de 35 años", min: 35 }
];

const Cate = () => {
  const navigate = useNavigate();

  const [inscriptos, setInscriptos] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    edad: "",
    documento: ""
  });
  const [datosUsuario, setDatosUsuario] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleInscripcion = (categoria) => {
    if (!form.nombre || !form.edad || !form.documento) {
      alert("Completá todos los campos");
      return;
    }

    if (parseInt(form.edad) < categoria.min) {
      alert(`Debés tener al menos ${categoria.min} años`);
      return;
    }

    if (inscriptos.includes(categoria.id)) {
      alert("Ya estás inscripto en esta categoría");
      return;
    }

    setInscriptos([...inscriptos, categoria.id]);

    setDatosUsuario({
      ...form,
      categoria: categoria.nombre,
      categoriaId: categoria.id
    });

    navigate(`/torneos/${categoria.id}/equipos`);
  };

  return (
    <div className="cate-container">
      <div className="cate-card">
        <h1 className="cate-title">Categorías Básquet Amateur</h1>

        <p className="cate-text">
          Completá tus datos e inscribite
        </p>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          className="cate-input"
        />

        <input
          type="number"
          name="edad"
          placeholder="Edad"
          value={form.edad}
          onChange={handleChange}
          className="cate-input"
        />

        <input
          type="text"
          name="documento"
          placeholder="Documento"
          value={form.documento}
          onChange={handleChange}
          className="cate-input"
        />

        {categorias.map((cat) => (
          <div key={cat.id} className="cate-item">
            <h2>{cat.nombre}</h2>
            <p>{cat.edad}</p>

            <button
              className="cate-button"
              onClick={() => handleInscripcion(cat)}
            >
              {inscriptos.includes(cat.id)
                ? "Inscripto ✔"
                : "Inscribirme"}
            </button>
          </div>
        ))}

        {datosUsuario && (
          <div className="cate-item">
            <h2>✅ Datos del jugador</h2>
            <p><strong>Nombre:</strong> {datosUsuario.nombre}</p>
            <p><strong>Edad:</strong> {datosUsuario.edad}</p>
            <p><strong>Documento:</strong> {datosUsuario.documento}</p>
            <p><strong>Categoría:</strong> {datosUsuario.categoria}</p>

            <button
              className="cate-button"
              onClick={() =>
                navigate(`/torneos/${datosUsuario.categoriaId}/fixture`)
              }
            >
              Ver Fixture
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cate;
