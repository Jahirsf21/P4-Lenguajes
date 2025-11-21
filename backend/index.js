import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import prisma from './database/prisma.js';

import rutasJugador from './routes/jugadorRoutes.js';
import rutasPartida from './routes/partidaRoutes.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/jugadores', rutasJugador);
app.use('/api/partidas', rutasPartida);


io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado:', socket.id);

  socket.on('unirse-a-sala', (partidaId) => {
    socket.join(partidaId); 
    console.log(`Cliente ${socket.id} se ha unido a la sala: ${partidaId}`);
  });


  socket.on('iniciar-partida', async (partidaId) => {
    console.log(`Recibida petición para iniciar la partida: ${partidaId}`);
    try {
      
      await prisma.partida.update({
        where: { id: partidaId },
        data: {
          estado: 'EN_PROGRESO',
          iniciadaEn: new Date()
        },
      });

      const tableroInicial = generarTableroInicial();
      io.to(partidaId).emit('partida-iniciada', {
        mensaje: '¡La partida ha comenzado!',
        tablero: tableroInicial
      });
      console.log(`Partida ${partidaId} iniciada. Notificando a la sala.`);

    } catch (error) {
      console.error(`Error al iniciar la partida ${partidaId}:`, error);
      socket.emit('error-al-iniciar', { mensaje: 'No se pudo iniciar la partida.' });
    }
  });


  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado:', socket.id);
  });
});


function generarTableroInicial() {
  const filas = 9;
  const columnas = 7;
  const colores = ['azul', 'naranja', 'rojo', 'verde', 'amarillo', 'morado'];
  const tablero = [];

  for (let i = 0; i < filas; i++) {
    const fila = [];
    for (let j = 0; j < columnas; j++) {
      const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
      fila.push(colorAleatorio);
    }
    tablero.push(fila);
  }
  return tablero;
}

httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});