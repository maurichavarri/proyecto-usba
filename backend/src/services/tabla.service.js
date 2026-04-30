const tabla = {};

fixture.forEach(partido => {
    if (partido.estado !== 'jugado') return;

    const local = partido.local.equipo_id;
    const visitante = partido.visitante.equipo_id;

    // inicializar
    if (!tabla[local]) tabla[local] = { puntos: 0 };
    if (!tabla[visitante]) tabla[visitante] = { puntos: 0 };

    if (partido.puntaje_local > partido.puntaje_visitante) {
        tabla[local].puntos += 2;
    } else {
        tabla[visitante].puntos += 2;
    }
});