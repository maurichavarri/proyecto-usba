import bcrypt from "bcryptjs";
import sequelize from "../config/db.js";
import jwt from "jsonwebtoken";
import Usuario from "../models/usuario.model.js";
import Delegado from "../models/delegado.model.js";

export const registerService = async (data) => {
  const { nombre, apellido, dni, fecha_nacimiento, sexo, correo, contraseña } = data;

  // =========================
  // CAMPOS OBLIGATORIOS
  // =========================

  if (
    !nombre ||
    !apellido ||
    !dni ||
    !fecha_nacimiento ||
    !sexo ||
    !correo ||
    !contraseña
  ) {
    const error = new Error("Todos los campos son obligatorios.");
    error.status = 400;
    throw error;
  }

  // =========================
  // NOMBRE Y APELLIDO
  // =========================

  if (!nombre.trim()) {
    const error = new Error("Debe ingresar un nombre.");
    error.status = 400;
    throw error;
  }

  if (!apellido.trim()) {
    const error = new Error("Debe ingresar un apellido.");
    error.status = 400;
    throw error;
  }

  // =========================
  // DNI
  // =========================

  if (!/^\d{7,8}$/.test(dni)) {
    const error = new Error("El DNI debe contener únicamente 7 u 8 números.");
    error.status = 400;
    throw error;
  }

  // =========================
  // SEXO
  // =========================

  if (sexo !== "masculino" && sexo !== "femenino") {
    const error = new Error("El sexo seleccionado no es válido.");
    error.status = 400;
    throw error;
  }

  // =========================
  // FECHA NACIMIENTO
  // =========================

  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha_nacimiento)) {
    const error = new Error("La fecha de nacimiento no es válida.");
    error.status = 400;
    throw error;
  }

  const [anio, mes, dia] = fecha_nacimiento.split("-").map(Number);
  const fechaNacimiento = new Date(anio, mes - 1, dia);

  if (
    fechaNacimiento.getFullYear() !== anio ||
    fechaNacimiento.getMonth() !== mes - 1 ||
    fechaNacimiento.getDate() !== dia
  ) {
    const error = new Error("La fecha de nacimiento no es válida.");
    error.status = 400;
    throw error;
  }

  const hoy = new Date();
  const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  if (fechaNacimiento > hoySinHora) {
    const error = new Error("La fecha de nacimiento no puede ser futura.");
    error.status = 400;
    throw error;
  }

  // =========================
  // NORMALIZAR CORREO
  // =========================

  const correoNormalizado = correo.trim().toLowerCase();

  // =========================
  // VERIFICAR CORREO
  // =========================

  const existeUsuario = await Usuario.findOne({
    where: {
      correo: correoNormalizado,
    },
  });

  if (existeUsuario) {
    const error = new Error("El correo ya está registrado.");
    error.status = 400;
    throw error;
  }

  // =========================
  // VERIFICAR DNI
  // =========================

  const existeDelegado = await Delegado.findOne({
    where: {
      dni,
    },
  });

  if (existeDelegado) {
    const error = new Error("Ya existe un delegado registrado con ese DNI.");
    error.status = 400;
    throw error;
  }

  // =========================
  // CONTRASEÑA
  // =========================

  if (contraseña.length < 6) {
    const error = new Error("La contraseña debe contener al menos 6 caracteres.",);
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);

  // =========================
  // TRANSACCIÓN
  // =========================

  const resultado = await sequelize.transaction(async (transaction) => {
    // CREAR USUARIO
    const usuario = await Usuario.create(
      {
        correo: correoNormalizado,
        contraseña: hashedPassword,
        rol: "delegado",
      },
      {
        transaction,
      },
    );

    // CREAR PERFIL DELEGADO
    const delegado = await Delegado.create(
      {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni,
        fecha_nacimiento,
        sexo,
        usuario_id: usuario.id,
      },
      {
        transaction,
      },
    );

    return {
      usuario,
      delegado,
    };
  });

  // =========================
  // RESPUESTA
  // =========================

  return {
    id: resultado.usuario.id,
    correo: resultado.usuario.correo,
    rol: resultado.usuario.rol,
    delegado: {
      id: resultado.delegado.id,
      nombre: resultado.delegado.nombre,
      apellido: resultado.delegado.apellido,
      dni: resultado.delegado.dni,
      fecha_nacimiento: resultado.delegado.fecha_nacimiento,
      sexo: resultado.delegado.sexo,
    },
  };
};

export const loginService = async (data) => {
  const { correo, contraseña } = data;

  // Validaciones
  if (!correo || !contraseña) {
    const error = new Error("Correo y contraseña son obligatorios");
    error.status = 400;
    throw error;
  }

  // Buscar usuario
  const usuario = await Usuario.findOne({
    where: { correo },
  });

  if (!usuario) {
    const error = new Error("Credenciales inválidas");
    error.status = 401;
    throw error;
  }

  // Comparar password
  const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña);

  if (!passwordValida) {
    const error = new Error("Credenciales inválidas");
    error.status = 401;
    throw error;
  }

  // Generar JWT
  const token = jwt.sign(
    {
      id: usuario.id,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // Respuesta
  return {
    usuario: {
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    },
    token,
  };
};