import { useState, useEffect } from 'react';
import axios from 'axios';
import { useGame } from '../context/GameContext';

const Lobby = () => {
  const [games, setGames] = useState([]);
  const { player, createGame, joinGame, setGame } = useGame();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/partidas');
        setGames(data);
      } catch (error) {
        console.error("Error al obtener partidas:", error);
      }
    };

    fetchGames();
    const interval = setInterval(fetchGames, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateGame = () => {
    createGame({
      tipoJuego: 'VS_TIEMPO',
      limiteTiempo: 300,
    });
  };
  

  const handleReconnect = (gameData) => {
    setGame(gameData);
  };

  return (
    <div className="container">
      <h2>Bienvenido, {player.nickname}!</h2>
      <h3>Partidas Disponibles</h3>
      <div className="game-list">
        {games.length === 0 ? (
          <p>No hay partidas disponibles. ¡Crea una!</p>
        ) : (
          games.map((game) => {

            const isPlayerInGame = game.jugadores.some(p => p.id === player.id);

            return (
              <div key={game.id} className="game-item">
                <span>Partida de {game.jugadores[0]?.nickname || '??'} ({game.cantidadJugadores}/2)</span>
                
 
                {isPlayerInGame ? (
                  <button onClick={() => handleReconnect(game)}>Entrar</button>
                ) : (
                  <button onClick={() => joinGame(game.id)} disabled={game.cantidadJugadores >= 2}>
                    Unirse
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
      <button onClick={handleCreateGame} className="create-game-btn">
        Crear Nueva Partida
      </button>
    </div>
  );
};

export default Lobby;