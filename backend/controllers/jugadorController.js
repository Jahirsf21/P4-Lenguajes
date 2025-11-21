import * as jugadorService from '../services/jugadorService.js';

export const registrarOIngresarJugador = async (req, res) => {
  const { nickname } = req.body;

  if (!nickname || nickname.trim() === '') {
    return res.status(400).json({ error: 'El nickname es requerido.' });
  }

  try {
    const { jugador, fueCreado } = await jugadorService.encontrarOCrearJugador(nickname);
    const statusCode = fueCreado ? 201 : 200;
    return res.status(statusCode).json(jugador);
  } catch (error) {
    console.error("Error al procesar jugador:", error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
};