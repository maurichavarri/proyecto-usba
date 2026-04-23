import { useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [seccion, setSeccion] = useState('categorias');

  const [categorias, setCategorias] = useState([
    { id: 1, nombre: 'Primera División', descripcion: 'Categoría principal' },
    { id: 2, nombre: 'Sub-23', descripcion: 'Jugadores menores de 23 años' },
  ]);

  const [equipos, setEquipos] = useState([
    { id: 1, nombre: 'Los Tigres', categoria: 'Primera División', contacto: '385-111111' },
    { id: 2, nombre: 'Deportivo Norte', categoria: 'Sub-23', contacto: '385-222222' },
  ]);

  const [torneos, setTorneos] = useState([
    { id: 1, nombre: 'Liga Principal 2026', categoria: 'Primera División', fechaInicio: '2026-04-01', estado: 'activo' },
  ]);

  const [partidos, setPartidos] = useState([
    { id: 1, torneo: 'Liga Principal 2026', local: 'Los Tigres', visitante: 'Deportivo Norte', fecha: '2026-04-19', hora: '10:00', cancha: 'Cancha 1' },
  ]);

  const [anuncios, setAnuncios] = useState([
    { id: 1, titulo: 'Bienvenidos a la temporada 2026', contenido: 'Arranca la nueva temporada con más equipos y categorías.', tipo: 'info', fecha: '2026-04-01' },
  ]);

  const [formCat, setFormCat] = useState({ nombre: '', descripcion: '' });
  const [formEquipo, setFormEquipo] = useState({ nombre: '', categoria: '', contacto: '' });
  const [formTorneo, setFormTorneo] = useState({ nombre: '', categoria: '', fechaInicio: '', estado: 'activo' });
  const [formPartido, setFormPartido] = useState({ torneo: '', local: '', visitante: '', fecha: '', hora: '', cancha: '' });
  const [formAnuncio, setFormAnuncio] = useState({ titulo: '', contenido: '', tipo: 'info' });

  const [errores, setErrores] = useState({});
  const [toast, setToast] = useState(null);

  const mostrarToast = (msg, tipo = 'ok') => {
    setToast({ msg, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const agregarCategoria = () => {
    const errs = {};
    if (!formCat.nombre.trim()) errs.catNombre = 'El nombre es obligatorio';
    if (Object.keys(errs).length) { setErrores(errs); return; }
    setCategorias([...categorias, { id: Date.now(), ...formCat }]);
    setFormCat({ nombre: '', descripcion: '' });
    setErrores({});
    mostrarToast('Categoría creada correctamente');
  };

  const eliminarCategoria = (id) => {
    setCategorias(categorias.filter(c => c.id !== id));
    mostrarToast('Categoría eliminada', 'error');
  };

  const agregarEquipo = () => {
    const errs = {};
    if (!formEquipo.nombre.trim()) errs.equipoNombre = 'El nombre es obligatorio';
    if (!formEquipo.categoria) errs.equipoCategoria = 'Seleccioná una categoría';
    if (Object.keys(errs).length) { setErrores(errs); return; }
    setEquipos([...equipos, { id: Date.now(), ...formEquipo }]);
    setFormEquipo({ nombre: '', categoria: '', contacto: '' });
    setErrores({});
    mostrarToast('Equipo creado correctamente');
  };

  const eliminarEquipo = (id) => {
    setEquipos(equipos.filter(e => e.id !== id));
    mostrarToast('Equipo eliminado', 'error');
  };

  const agregarTorneo = () => {
    const errs = {};
    if (!formTorneo.nombre.trim()) errs.torneoNombre = 'El nombre es obligatorio';
    if (!formTorneo.categoria) errs.torneoCategoria = 'Seleccioná una categoría';
    if (!formTorneo.fechaInicio) errs.torneoFecha = 'La fecha es obligatoria';
    if (categorias.length === 0) errs.torneoSinCat = 'No hay categorías creadas.';
    if (Object.keys(errs).length) { setErrores(errs); return; }
    setTorneos([...torneos, { id: Date.now(), ...formTorneo }]);
    setFormTorneo({ nombre: '', categoria: '', fechaInicio: '', estado: 'activo' });
    setErrores({});
    mostrarToast('Torneo creado correctamente');
  };

  const eliminarTorneo = (id) => {
    setTorneos(torneos.filter(t => t.id !== id));
    mostrarToast('Torneo eliminado', 'error');
  };

  const agregarPartido = () => {
    const errs = {};
    if (!formPartido.torneo) errs.partidoTorneo = 'Seleccioná un torneo';
    if (!formPartido.local) errs.partidoLocal = 'Seleccioná el equipo local';
    if (!formPartido.visitante) errs.partidoVisitante = 'Seleccioná el equipo visitante';
    if (formPartido.local && formPartido.visitante && formPartido.local === formPartido.visitante) errs.partidoIgual = 'No pueden ser el mismo equipo';
    if (!formPartido.fecha) errs.partidoFecha = 'La fecha es obligatoria';
    if (!formPartido.hora) errs.partidoHora = 'El horario es obligatorio';
    if (!formPartido.cancha.trim()) errs.partidoCancha = 'La cancha es obligatoria';
    if (Object.keys(errs).length) { setErrores(errs); return; }
    setPartidos([...partidos, { id: Date.now(), ...formPartido }]);
    setFormPartido({ torneo: '', local: '', visitante: '', fecha: '', hora: '', cancha: '' });
    setErrores({});
    mostrarToast('Partido agendado correctamente');
  };

  const eliminarPartido = (id) => {
    setPartidos(partidos.filter(p => p.id !== id));
    mostrarToast('Partido eliminado', 'error');
  };

  const agregarAnuncio = () => {
    const errs = {};
    if (!formAnuncio.titulo.trim()) errs.anuncioTitulo = 'El título es obligatorio';
    if (!formAnuncio.contenido.trim()) errs.anuncioContenido = 'El contenido es obligatorio';
    if (Object.keys(errs).length) { setErrores(errs); return; }
    const fecha = new Date().toISOString().split('T')[0];
    setAnuncios([{ id: Date.now(), fecha, ...formAnuncio }, ...anuncios]);
    setFormAnuncio({ titulo: '', contenido: '', tipo: 'info' });
    setErrores({});
    mostrarToast('Anuncio publicado correctamente');
  };

  const eliminarAnuncio = (id) => {
    setAnuncios(anuncios.filter(a => a.id !== id));
    mostrarToast('Anuncio eliminado', 'error');
  };

  const nav = [
    { key: 'categorias', label: 'Categorías', emoji: '🏷️' },
    { key: 'equipos',    label: 'Equipos',    emoji: '👥' },
    { key: 'torneos',    label: 'Torneos',    emoji: '🏆' },
    { key: 'partidos',   label: 'Partidos',   emoji: '🏀' },
    { key: 'anuncios',   label: 'Anuncios',   emoji: '📢' },
  ];

  const tipoAnuncioBadge = {
    info:      { clase: 'estado-activo',     label: 'Info' },
    importante: { clase: 'estado-pendiente', label: 'Importante' },
    urgente:   { clase: 'estado-finalizado', label: 'Urgente' },
  };

  return (
    <div className="container-fluid p-0 overflow-hidden">
      <div className="d-flex">

        {/* Sidebar */}
        <aside className="admin-sidebar sticky-top d-flex flex-column p-3">
          <h4 className="sidebar-title mb-4 px-2">Panel Admin</h4>
          <div className="nav flex-column gap-2">
            {nav.map(n => (
              <button
                key={n.key}
                className={`nav-link sidebar-btn border-0 py-2 px-3 ${seccion === n.key ? 'active' : ''}`}
                onClick={() => { setSeccion(n.key); setErrores({}); }}
              >
                <span className="me-2">{n.emoji}</span>
                <span className="d-none d-md-inline">{n.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-grow-1 p-3 p-md-5">

          {/* Toast */}
          {toast && (
            <div className={`toast-custom ${toast.tipo === 'error' ? 'toast-error' : 'toast-ok'}`}>
              {toast.tipo === 'ok' ? '✅' : '🗑️'} {toast.msg}
            </div>
          )}

          <div className="mb-4">
            <h2 className="admin-titulo-seccion">
              {nav.find(n => n.key === seccion)?.emoji} {nav.find(n => n.key === seccion)?.label}
            </h2>
          </div>

          {/* CATEGORÍAS */}
          {seccion === 'categorias' && (
            <div className="row g-4">
              <div className="col-12">
                <div className="card admin-form-card p-4 rounded-3">
                  <h5 className="form-titulo-bs mb-3">Nueva Categoría</h5>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label text-muted small text-uppercase fw-bold">Nombre *</label>
                      <input
                        className="form-control"
                        placeholder="Ej: Primera División"
                        value={formCat.nombre}
                        onChange={e => setFormCat({ ...formCat, nombre: e.target.value })}
                      />
                      {errores.catNombre && <div className="text-danger small mt-1">{errores.catNombre}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-muted small text-uppercase fw-bold">Descripción</label>
                      <input
                        className="form-control"
                        placeholder="Opcional"
                        value={formCat.descripcion}
                        onChange={e => setFormCat({ ...formCat, descripcion: e.target.value })}
                      />
                    </div>
                  </div>
                  <button className="btn btn-orange mt-4 px-4" onClick={agregarCategoria}>
                    + Agregar categoría
                  </button>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex flex-column gap-2">
                  {categorias.length === 0 && <p className="text-center text-muted py-4">No hay categorías aún.</p>}
                  {categorias.map(c => (
                    <div key={c.id} className="lista-item p-3 rounded-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-bold text-light">{c.nombre}</h6>
                        {c.descripcion && <p className="item-sub mb-0">{c.descripcion}</p>}
                      </div>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarCategoria(c.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EQUIPOS */}
          {seccion === 'equipos' && (
            <div className="row g-4">
              <div className="col-12">
                <div className="card admin-form-card p-4 rounded-3">
                  <h5 className="form-titulo-bs mb-3">Nuevo Equipo</h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Nombre *</label>
                      <input
                        className="form-control"
                        placeholder="Ej: Los Tigres"
                        value={formEquipo.nombre}
                        onChange={e => setFormEquipo({ ...formEquipo, nombre: e.target.value })}
                      />
                      {errores.equipoNombre && <div className="text-danger small mt-1">{errores.equipoNombre}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Categoría *</label>
                      <select
                        className="form-select"
                        value={formEquipo.categoria}
                        onChange={e => setFormEquipo({ ...formEquipo, categoria: e.target.value })}
                      >
                        <option value="">Seleccioná...</option>
                        {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                      </select>
                      {errores.equipoCategoria && <div className="text-danger small mt-1">{errores.equipoCategoria}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Contacto</label>
                      <input
                        className="form-control"
                        placeholder="Teléfono o email"
                        value={formEquipo.contacto}
                        onChange={e => setFormEquipo({ ...formEquipo, contacto: e.target.value })}
                      />
                    </div>
                  </div>
                  <button className="btn btn-orange mt-4 px-4" onClick={agregarEquipo}>
                    + Agregar equipo
                  </button>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex flex-column gap-2">
                  {equipos.length === 0 && <p className="text-center text-muted py-4">No hay equipos aún.</p>}
                  {equipos.map(e => (
                    <div key={e.id} className="lista-item p-3 rounded-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-bold text-light">{e.nombre}</h6>
                        <p className="item-sub mb-0">{e.categoria} {e.contacto && `· ${e.contacto}`}</p>
                      </div>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarEquipo(e.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TORNEOS */}
          {seccion === 'torneos' && (
            <div className="row g-4">
              <div className="col-12">
                {categorias.length === 0 && (
                  <div className="alert border-0 mb-4 alerta-sin-cat">
                    ⚠️ No hay categorías. Andá a <strong>Categorías</strong> antes de crear un torneo.
                  </div>
                )}
                <div className="card admin-form-card p-4 rounded-3">
                  <h5 className="form-titulo-bs mb-3">Nuevo Torneo</h5>
                  {errores.torneoSinCat && <div className="text-danger small mb-3">{errores.torneoSinCat}</div>}
                  <div className="row g-3">
                    <div className="col-md-6 col-lg-3">
                      <label className="form-label text-muted small text-uppercase fw-bold">Nombre *</label>
                      <input
                        className="form-control"
                        placeholder="Ej: Liga Principal 2026"
                        value={formTorneo.nombre}
                        onChange={e => setFormTorneo({ ...formTorneo, nombre: e.target.value })}
                      />
                      {errores.torneoNombre && <div className="text-danger small mt-1">{errores.torneoNombre}</div>}
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <label className="form-label text-muted small text-uppercase fw-bold">Categoría *</label>
                      <select
                        className="form-select"
                        value={formTorneo.categoria}
                        onChange={e => setFormTorneo({ ...formTorneo, categoria: e.target.value })}
                        disabled={categorias.length === 0}
                      >
                        <option value="">Seleccioná...</option>
                        {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                      </select>
                      {errores.torneoCategoria && <div className="text-danger small mt-1">{errores.torneoCategoria}</div>}
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <label className="form-label text-muted small text-uppercase fw-bold">Inicio *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formTorneo.fechaInicio}
                        onChange={e => setFormTorneo({ ...formTorneo, fechaInicio: e.target.value })}
                      />
                      {errores.torneoFecha && <div className="text-danger small mt-1">{errores.torneoFecha}</div>}
                    </div>
                    <div className="col-md-6 col-lg-3">
                      <label className="form-label text-muted small text-uppercase fw-bold">Estado</label>
                      <select
                        className="form-select"
                        value={formTorneo.estado}
                        onChange={e => setFormTorneo({ ...formTorneo, estado: e.target.value })}
                      >
                        <option value="activo">Activo</option>
                        <option value="finalizado">Finalizado</option>
                        <option value="pendiente">Pendiente</option>
                      </select>
                    </div>
                  </div>
                  <button className="btn btn-orange mt-4 px-4" onClick={agregarTorneo} disabled={categorias.length === 0}>
                    + Agregar torneo
                  </button>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex flex-column gap-2">
                  {torneos.length === 0 && <p className="text-center text-muted py-4">No hay torneos aún.</p>}
                  {torneos.map(t => (
                    <div key={t.id} className="lista-item p-3 rounded-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-bold text-light">{t.nombre}</h6>
                        <p className="item-sub mb-0">
                          {t.categoria} · Inicio: {t.fechaInicio} ·
                          <span className={`badge ms-2 estado-badge estado-${t.estado}`}>{t.estado}</span>
                        </p>
                      </div>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarTorneo(t.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PARTIDOS */}
          {seccion === 'partidos' && (
            <div className="row g-4">
              <div className="col-12">
                <div className="card admin-form-card p-4 rounded-3">
                  <h5 className="form-titulo-bs mb-3">Agendar Partido</h5>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Torneo *</label>
                      <select
                        className="form-select"
                        value={formPartido.torneo}
                        onChange={e => setFormPartido({ ...formPartido, torneo: e.target.value })}
                      >
                        <option value="">Seleccioná...</option>
                        {torneos.map(t => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
                      </select>
                      {errores.partidoTorneo && <div className="text-danger small mt-1">{errores.partidoTorneo}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Local *</label>
                      <select
                        className="form-select"
                        value={formPartido.local}
                        onChange={e => setFormPartido({ ...formPartido, local: e.target.value })}
                      >
                        <option value="">Seleccioná...</option>
                        {equipos.map(e => <option key={e.id} value={e.nombre}>{e.nombre}</option>)}
                      </select>
                      {errores.partidoLocal && <div className="text-danger small mt-1">{errores.partidoLocal}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Visitante *</label>
                      <select
                        className="form-select"
                        value={formPartido.visitante}
                        onChange={e => setFormPartido({ ...formPartido, visitante: e.target.value })}
                      >
                        <option value="">Seleccioná...</option>
                        {equipos.map(e => <option key={e.id} value={e.nombre}>{e.nombre}</option>)}
                      </select>
                      {errores.partidoVisitante && <div className="text-danger small mt-1">{errores.partidoVisitante}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Fecha *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formPartido.fecha}
                        onChange={e => setFormPartido({ ...formPartido, fecha: e.target.value })}
                      />
                      {errores.partidoFecha && <div className="text-danger small mt-1">{errores.partidoFecha}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Hora *</label>
                      <input
                        type="time"
                        className="form-control"
                        value={formPartido.hora}
                        onChange={e => setFormPartido({ ...formPartido, hora: e.target.value })}
                      />
                      {errores.partidoHora && <div className="text-danger small mt-1">{errores.partidoHora}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Cancha *</label>
                      <input
                        className="form-control"
                        placeholder="Ej: Cancha 1"
                        value={formPartido.cancha}
                        onChange={e => setFormPartido({ ...formPartido, cancha: e.target.value })}
                      />
                      {errores.partidoCancha && <div className="text-danger small mt-1">{errores.partidoCancha}</div>}
                    </div>
                  </div>
                  {errores.partidoIgual && <div className="text-danger small mt-2">{errores.partidoIgual}</div>}
                  <button className="btn btn-orange mt-4 px-4" onClick={agregarPartido}>
                    + Agendar partido
                  </button>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex flex-column gap-2">
                  {partidos.length === 0 && <p className="text-center text-muted py-4">No hay partidos agendados.</p>}
                  {partidos.map(p => (
                    <div key={p.id} className="lista-item p-3 rounded-3 d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1 fw-bold text-light">
                          {p.local} <span className="text-orange mx-2">vs</span> {p.visitante}
                        </h6>
                        <p className="item-sub mb-0">{p.torneo} · {p.fecha} · {p.hora}hs · {p.cancha}</p>
                      </div>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarPartido(p.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ANUNCIOS */}
          {seccion === 'anuncios' && (
            <div className="row g-4">
              <div className="col-12">
                <div className="card admin-form-card p-4 rounded-3">
                  <h5 className="form-titulo-bs mb-3">Nuevo Anuncio</h5>
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label text-muted small text-uppercase fw-bold">Título *</label>
                      <input
                        className="form-control"
                        placeholder="Ej: Suspensión de partido por lluvia"
                        value={formAnuncio.titulo}
                        onChange={e => setFormAnuncio({ ...formAnuncio, titulo: e.target.value })}
                      />
                      {errores.anuncioTitulo && <div className="text-danger small mt-1">{errores.anuncioTitulo}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small text-uppercase fw-bold">Tipo</label>
                      <select
                        className="form-select"
                        value={formAnuncio.tipo}
                        onChange={e => setFormAnuncio({ ...formAnuncio, tipo: e.target.value })}
                      >
                        <option value="info">Info</option>
                        <option value="importante">Importante</option>
                        <option value="urgente">Urgente</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label text-muted small text-uppercase fw-bold">Contenido *</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Escribí el mensaje del anuncio..."
                        value={formAnuncio.contenido}
                        onChange={e => setFormAnuncio({ ...formAnuncio, contenido: e.target.value })}
                        style={{ resize: 'vertical' }}
                      />
                      {errores.anuncioContenido && <div className="text-danger small mt-1">{errores.anuncioContenido}</div>}
                    </div>
                  </div>
                  <button className="btn btn-orange mt-4 px-4" onClick={agregarAnuncio}>
                    + Publicar anuncio
                  </button>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex flex-column gap-2">
                  {anuncios.length === 0 && <p className="text-center text-muted py-4">No hay anuncios publicados.</p>}
                  {anuncios.map(a => (
                    <div key={a.id} className="lista-item p-3 rounded-3 d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1 me-3">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="mb-0 fw-bold text-light">{a.titulo}</h6>
                          <span className={`badge estado-badge ${tipoAnuncioBadge[a.tipo]?.clase}`}>
                            {tipoAnuncioBadge[a.tipo]?.label}
                          </span>
                        </div>
                        <p className="item-sub mb-1">{a.contenido}</p>
                        <span className="item-sub" style={{ fontSize: 11 }}>📅 {a.fecha}</span>
                      </div>
                      <button className="btn btn-outline-danger btn-sm flex-shrink-0" onClick={() => eliminarAnuncio(a.id)}>Eliminar</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Admin;