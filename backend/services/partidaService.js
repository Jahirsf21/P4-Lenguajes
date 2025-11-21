import prisma from '../database/prisma.js';

export const crearNuevaPartida = async (datosPartida) => {
  const { tipoJuego, tematica, limiteMatch, limiteTiempo, hostId } = datosPartida;

  const nuevaPartida = await prisma.partida.create({
    data: {
      tipoJuego,
      tematica: tematica || 'default',
      limiteMatch,
      limiteTiempo,
      jugadores: {
        create: {
          jugadorId: hostId,
        },
      },
    },
    include: {
      jugadores: { include: { jugador: true } },
    },
  });

  return nuevaPartida;
};

export const obtenerPartidasEnEspera = async () => {
  const partidasEnEspera = await prisma.partida.findMany({
    where: { estado: 'ESPERANDO' },
    include: {
      jugadores: {
        select: {
          jugador: { select: { id: true, nickname: true } },
        },
      },
    },
    orderBy: { creadaEn: 'desc' },
  });

  return partidasEnEspera.map(partida => ({
    ...partida,
    cantidadJugadores: partida.jugadores.length,
    jugadores: partida.jugadores.map(p => p.jugador),
  }));
};

export const unirJugadorAPartida = async (partidaId, jugadorId) => {

  const nuevaUnion = await prisma.partidaJugador.create({
    data: {
      partidaId: partidaId,
      jugadorId: jugadorId,
    },
    include: {
      partida: {
        include: {
          jugadores: {
            include: {
              jugador: true,
            },
          },
        },
      },
    },
  });
  return nuevaUnion;
};