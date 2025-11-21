import { useEffect } from 'react';
import { useGame } from '../context/GameContext';

const GameRoom = () => {
  const { game, player, socket } = useGame();

  useEffect(() => {
    if (socket && game) {
      socket.emit('unirse-a-sala', game.id);
    }
  }, [socket, game]);

  const handleStartGame = () => {
    if (socket && game) {
      socket.emit('iniciar-partida', game.id);
    }
  };

  const isHost = game?.jugadores[0]?.id === player.id;


  const isReadyToStart = game?.cantidadJugadores >= 2;

  return (
    <div className="container">
      <h2>Sala de la Partida</h2>
      <p>ID de la Partida: {game.id}</p>
      <h3>Jugadores Conectados ({game.cantidadJugadores}):</h3>
      
      {/* Usamos un estilo más limpio para la lista */}
      <ul className="player-list">
        {game.jugadores.map((p, index) => (
          <li key={p.id}>
            {p.nickname} {index === 0 && '(Anfitrión)'}
          </li>
        ))}
      </ul>

      {isHost && isReadyToStart && (
        <button onClick={handleStartGame} className="start-game-btn">
          Iniciar Partida
        </button>
      )}

      {isHost && !isReadyToStart && (
        <p className="waiting-text">Esperando a que se unan otros jugadores...</p>
      )}

      {!isHost && (
         <p className="waiting-text">Esperando a que el anfitrión inicie la partida...</p>
      )}

    </div>
  );
};

export default GameRoom;