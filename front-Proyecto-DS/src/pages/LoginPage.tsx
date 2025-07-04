import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Por favor, ingresa tu usuario y contraseña.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/usuarios/filter', {
        usuario: username,
        contrasenia: password
      });

      if (response.data.length > 0) {
        const user = response.data[0];
        login(user);
        if (user.tipoUsuarioId === 3) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError('Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor, intenta de nuevo.');
      console.error(err);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg" style={{ width: '24rem' }}>
        <div className="card-body p-5">
          <h1 className="card-title text-center mb-4">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Usuario</label>
              <input
                id="username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Iniciar Sesión
              </button>
            </div>
            <div className="d-grid mt-3">
              <Link to="/signup" className="btn btn-secondary">
                Registrarse
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
