import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, isDoctor, logout, user } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">HereDoctor</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">Quiénes Somos</Link>
            </li>
          </ul>
          {location.pathname !== '/login' ? (
            <ul className="navbar-nav ms-auto">
              {!isAuthenticated ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <span className="navbar-text me-3 navbar-username">
                      Hola, {user?.usuario}
                    </span>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">Home</Link>
                  </li>
                   <li className="nav-item">
                    <Link className="nav-link" to="/profile">Mi Perfil</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/chatbot">Chatbot</Link>
                  </li>
                  {isDoctor && (
                     <li className="nav-item">
                      <Link className="nav-link" to="/doctor/dashboard">Mi Panel</Link>
                    </li>
                  )}
                  {isAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">Admin Panel</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={logout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
