import express from 'express';
import { registrarOIngresarJugador } from '../controllers/jugadorController.js';

const router = express.Router();

router.post('/', registrarOIngresarJugador);

export default router;