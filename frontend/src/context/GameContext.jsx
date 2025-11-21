import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const API_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);
  const [game, setGame] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket) return;
    const handleGameStarted = (gameData) => {
      console.log('¡Partida iniciada!', gameData);
      setGame(prevState => ({
          ...prevState,
          estado: 'EN_PROGRESO',
          tablero: gameData.tablero
      }));
    };

    socket.on('partida-iniciada', handleGameStarted);

    return () => {
      socket.off('partida-iniciada', handleGameStarted);
    };
  }, [socket]);

  const login = async (nickname) => {
    try {
      const { data } = await axios.post(`${API_URL}/jugadores`, { nickname });
      setPlayer(data);
    
      const newSocket = io(SOCKET_URL);
      setSocket(newSocket);
      
      return true;
    } catch (error) {
      console.error("Error en el login:", error);
      return false;
    }
  };

  const createGame = async (gameConfig) => {
    try {
      const { data } = await axios.post(`${API_URL}/partidas`, {
        ...gameConfig,
        hostId: player.id,
      });
      setGame(data);
    } catch (error) {
      console.error("Error creando la partida:", error);
    }
  };

  const joinGame = async (partidaId) => {
     try {
      const { data } = await axios.post(`${API_URL}/partidas/${partidaId}/unirse`, {
        jugadorId: player.id,
      });
      setGame(data);
    } catch (error) {
      console.error("Error al unirse a la partida:", error);
    }
  };


  const value = {
    player,
    game,
    socket,
    login,
    createGame,
    joinGame,
    setGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};