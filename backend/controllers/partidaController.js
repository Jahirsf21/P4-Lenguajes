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