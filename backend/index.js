import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rutasJugador from './routes/jugadorRoutes.js';
import rutasPartida from './routes/partidaRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/api/jugadores', rutasJugador);
app.use('/api/partidas', rutasPartida);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});