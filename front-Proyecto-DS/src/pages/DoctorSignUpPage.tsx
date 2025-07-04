import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorSignUpPage = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    usuario: '',
    contrasenia: '',
    especialidadId: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Crear la persona
      const personaResponse = await axios.post('http://localhost:3001/api/personas', {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        dni: formData.dni,
      });

      // 2. Crear el usuario
      await axios.post('http://localhost:3001/api/usuarios', {
        dniPersona: formData.dni,
        tipoUsuarioId: 2, // Doctor
        usuario: formData.usuario,
        contrasenia: formData.contrasenia,
        estado: "ACTIVO"
      });
      
      // 3. (Opcional) Asociar especialidad - Esto dependerá de la lógica de negocio
      // Por ahora, asumimos que la especialidad se maneja por separado.

      navigate('/login');

    } catch (err) {
      setError('Ocurrió un error durante el registro. Verifica que el DNI o usuario no existan.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Registro para Doctores</h2>
              <p className="text-center mb-4">Únete a nuestra red de profesionales.</p>
              <form onSubmit={handleSignUp}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nombres" className="form-label">Nombres</label>
                    <input type="text" name="nombres" className="form-control" onChange={handleChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="apellidos" className="form-label">Apellidos</label>
                    <input type="text" name="apellidos" className="form-control" onChange={handleChange} required />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="dni" className="form-label">DNI</label>
                  <input type="text" name="dni" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label">Usuario</label>
                  <input type="text" name="usuario" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="contrasenia" className="form-label">Contraseña</label>
                  <input type="password" name="contrasenia" className="form-control" onChange={handleChange} required />
                </div>
                {/* Aquí se podría agregar un selector de especialidades */}
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Registrarse</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignUpPage;