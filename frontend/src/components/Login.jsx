import { useState } from 'react';
import { useGame } from '../context/GameContext';

const Login = () => {
  const [nickname, setNickname] = useState('');
  const { login } = useGame();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    await login(nickname);
  };

  return (
    <div className="container">
      <h1>Match-3 Game</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Ingresa tu nickname"
          required
        />
        <button type="submit">Jugar</button>
      </form>
    </div>
  );
};

export default Login;