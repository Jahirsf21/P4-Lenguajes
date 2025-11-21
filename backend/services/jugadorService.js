import prisma from '../database/prisma.js';

export const encontrarOCrearJugador = async (nickname) => {
  const jugadorExistente = await prisma.jugador.findUnique({
    where: { nickname },
  });

  if (jugadorExistente) {
    return { jugador: jugadorExistente, fueCreado: false };
  }

  const nuevoJugador = await prisma.jugador.create({
    data: { nickname },
  });
  
  return { jugador: nuevoJugador, fueCreado: true };
};


