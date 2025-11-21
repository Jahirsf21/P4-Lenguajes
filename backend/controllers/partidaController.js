import * as partidaService from '../services/partidaService.js';

export const crearPartida = async (req, res) => {
  const { tipoJuego, hostId, limiteMatch, limiteTiempo } = req.body;

  if (!tipoJuego || !hostId) {
    return res.status(400).json({ error: 'tipoJuego y hostId son requeridos.' });
  }

  try {
    const nuevaPartida = await partidaService.crearNuevaPartida(req.body);
    res.status(201).json(nuevaPartida);
  } catch (error) {
    console.error("Error al crear la partida:", error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const listarPartidasEnEspera = async (req, res) => {
  try {
    const partidas = await partidaService.obtenerPartidasEnEspera();
    res.status(200).json(partidas);
  } catch (error)
    {
    console.error("Error al listar partidas:", error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

export const unirAPartida = async (req,res) => {
  const { partidaId } = req.params;
  const { jugadorId } = req.body
  if (!jugadorId) {
    return res.status(400).json({ error: 'jugadorId es requerido.' });
  }
  try {
    const resultado = await partidaService.unirJugadorAPartida(partidaId, jugadorId);
    res.status(200).json(resultado.partida);
  } catch (error) {
    console.error("Error al unir jugador a la partida:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'El jugador ya está en esta partida.'});
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'La partida o el jugador no existen.'});
    }
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}