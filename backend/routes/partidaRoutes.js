import express from 'express';
import { crearPartida, listarPartidasEnEspera } from '../controllers/partidaController.js';

const router = express.Router();

router.post('/', crearPartida);
router.get('/', listarPartidasEnEspera);

export default router;