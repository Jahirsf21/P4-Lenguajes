import express from 'express';
import { crearPartida, listarPartidasEnEspera, unirAPartida } from '../controllers/partidaController.js';

const router = express.Router();

router.post('/', crearPartida);
router.get('/', listarPartidasEnEspera);
router.post('/:partidaId/unirse', unirAPartida);

export default router;