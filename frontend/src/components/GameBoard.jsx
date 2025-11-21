import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const GameBoard = () => {

  const { game, player, socket } = useGame();

  if (!game || !game.tablero) {
    return <div className="container">Cargando tablero...</div>;
  }
  
  const { tablero } = game;

  const [selectedTiles, setSelectedTiles] = useState([]);

  const [lockedTiles, setLockedTiles] = useState([]);

  useEffect(() => {
    if (!socket) return; 

    const handleTileLocked = ({ tile, jugadorId }) => {

      setLockedTiles(prev => {
        const isAlreadyLocked = prev.some(
          t => t.fila === tile.fila && t.col === tile.col
        );
        return isAlreadyLocked ? prev : [...prev, tile];
      });
    };

    const handleTileUnlocked = ({ tile }) => {
      setLockedTiles(prev => prev.filter(
        t => !(t.fila === tile.fila && t.col === tile.col)
      ));
    };


    socket.on('ficha-bloqueada', handleTileLocked);
    socket.on('ficha-desbloqueada', handleTileUnlocked);

    return () => {
      socket.off('ficha-bloqueada', handleTileLocked);
      socket.off('ficha-desbloqueada', handleTileUnlocked);
    };
  }, [socket]); 


  const isSelected = (rowIndex, colIndex) => {
    return selectedTiles.some(
      (tile) => tile.fila === rowIndex && tile.col === colIndex
    );
  };

  const isLocked = (rowIndex, colIndex) => {
    return lockedTiles.some(
      (tile) => tile.fila === rowIndex && tile.col === colIndex
    );
  };

  const handleTileClick = (rowIndex, colIndex) => {
    if (isLocked(rowIndex, colIndex)) {
      return;
    }

    const clickedTile = { fila: rowIndex, col: colIndex };
    const isAlreadySelected = isSelected(rowIndex, colIndex);

    if (isAlreadySelected) {
      setSelectedTiles(prev => prev.filter(
        (tile) => !(tile.fila === rowIndex && tile.col === colIndex)
      ));
      socket.emit('deseleccionar-ficha', {
        partidaId: game.id,
        tile: clickedTile,
        jugadorId: player.id
      });
    } else {
      setSelectedTiles(prev => [...prev, clickedTile]);
      socket.emit('seleccionar-ficha', {
        partidaId: game.id,
        tile: clickedTile,
        jugadorId: player.id
      });
    }
  };

  return (
    <div className="container">
      <h2>¡A Jugar! - Turno de {player?.nickname}</h2> 
      <div className="game-board">
        {tablero.map((row, rowIndex) => (
          
          <React.Fragment key={rowIndex}> 
            {row.map((cellColor, colIndex) => {
              const cellClasses = `board-cell tile-${cellColor} ${
                isSelected(rowIndex, colIndex) ? 'selected' : ''
              } ${isLocked(rowIndex, colIndex) ? 'locked' : ''}`;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cellClasses}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <button className="activate-btn">Activar Combinación ({selectedTiles.length})</button>
    </div>
  );
};

export default GameBoard;