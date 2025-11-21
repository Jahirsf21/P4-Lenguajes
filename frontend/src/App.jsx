import { useGame } from './context/GameContext';
import Login from './components/Login';
import Lobby from './components/Lobby';
import GameRoom from './components/GameRoom';
import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  const { player, game } = useGame();

  const renderContent = () => {
    if (!player) {
      return <Login />;
    }
    if (game) {
        if (game.estado === 'EN_PROGRESO') {
            return <GameBoard board={game.tablero} />;
        }
        return <GameRoom />;
    }
    return <Lobby />;
  };

  return <div className="app-container">{renderContent()}</div>;
}

export default App;