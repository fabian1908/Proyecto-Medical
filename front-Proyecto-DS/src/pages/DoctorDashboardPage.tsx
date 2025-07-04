import { useAuth } from '../context/AuthContext';

const DoctorDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="container mt-5">
      <h1>Bienvenido, Dr. {user?.usuario}</h1>
      <p>Este es tu panel de control. Desde aquí podrás gestionar tu perfil, horarios y citas.</p>
      
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Gestionar Perfil</h5>
              <p className="card-text">Actualiza tu información personal y de contacto.</p>
              {/* Link a la página de edición de perfil */}
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Ver Citas</h5>
              <p className="card-text">Consulta tus próximas citas y el historial de pacientes.</p>
              {/* Link a la página de gestión de citas */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;