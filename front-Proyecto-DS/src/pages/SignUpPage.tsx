import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !dni || !nombre || !apellido || !fechaNacimiento || !telefono || !email || !direccion) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      // Primero, verificamos si la persona con ese DNI existe
      //const personaResponse = await axios.post('http://localhost:3001/api/personas/filter', { dni });
      //if (personaResponse.data.length === 0) {
      //  setError('No existe una persona registrada con ese DNI. Por favor, contacta a administración.');
      //  return;
      //}

      // Creamos la nueva persona
      await axios.post('http://localhost:3001/api/personas', {
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        fechaNacimiento: fechaNacimiento,
        telefono: telefono,
        email: email,
        direccion: direccion
      });

      // Creamos el nuevo usuario
      await axios.post('http://localhost:3001/api/usuarios', {
        dniPersona: dni,
        tipoUsuarioId: 1, // Por defecto, se registra como paciente (ID 1)
        usuario: username,
        contrasenia: password, // En una app real, esto debería ser hasheado
        estado: "ACTIVO"
      });

      // Redirigir al login después del registro exitoso
      navigate('/login');

    } catch (err) {
      setError('Ocurrió un error durante el registro. El usuario podría ya existir.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Registro de Usuario</h2>
              <form onSubmit={handleSignUp}>
                <div className="mb-3">
                  <label htmlFor="dni" className="form-label">DNI</label>
                  <input
                    type="text"
                    className="form-control"
                    id="dni"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="DNI de la persona registrada"
                  />
                </div>
                 <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="apellido" className="form-label">Apellido</label>
                  <input
                    type="text"
                    className="form-control"
                    id="apellido"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    placeholder="Apellido"
                  />
                </div>
                 <div className="mb-3">
                  <label htmlFor="fechaNacimiento" className="form-label">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaNacimiento"
                    value={fechaNacimiento}
                    onChange={(e) => setFechaNacimiento(e.target.value)}
                    placeholder="Fecha de Nacimiento"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Teléfono"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Dirección"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nombre.apellido"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Registrarse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
