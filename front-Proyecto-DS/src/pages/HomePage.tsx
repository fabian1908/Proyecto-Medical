import { useState, useEffect } from 'react';
import axios from 'axios';
import { Stethoscope } from 'lucide-react';

// Tipos de datos
interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Medico {
  id: number;
  nombres: string;
  apellidos: string;
  especialidad: string;
  fotoUrl: string;
}

const HomePage = () => {
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch especialidades
        const espResponse = await axios.get('http://localhost:3001/api/especialidades');
        setEspecialidades(espResponse.data);

        // Fetch médicos (simulado, ya que no hay un endpoint directo para médicos con especialidad)
        // En un caso real, el backend debería proveer esta información
        const medicosSimulados: Medico[] = [
          { id: 1, nombres: 'Juan', apellidos: 'Pérez', especialidad: 'Cardiología', fotoUrl: '/src/assets/img/doctors/doctors-1.jpg' },
          { id: 2, nombres: 'Ana', apellidos: 'Gómez', especialidad: 'Dermatología', fotoUrl: '/src/assets/img/doctors/doctors-2.jpg' },
          { id: 3, nombres: 'Luis', apellidos: 'Martínez', especialidad: 'Pediatría', fotoUrl: '/src/assets/img/doctors/doctors-3.jpg' },
          { id: 4, nombres: 'María', apellidos: 'Rodríguez', especialidad: 'Ginecología', fotoUrl: '/src/assets/img/doctors/doctors-4.jpg' },
        ];
        setMedicos(medicosSimulados);
        
        setError('');
      } catch (err) {
        setError('No se pudo cargar la información. Inténtalo de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Cargando...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 text-white text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Bienvenido a HereDoctor</h1>
        <p className="text-xl">Tu portal de salud de confianza.</p>
      </section>

      {/* Sección de Especialidades */}
      <section id="especialidades" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nuestras Especialidades</h2>
            <p className="text-gray-600 mt-2">Ofrecemos una amplia gama de servicios médicos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {especialidades.map((esp) => (
              <div key={esp.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Stethoscope className="text-blue-600 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">{esp.nombre}</h3>
                </div>
                <p className="text-gray-600">{esp.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Médicos */}
      <section id="medicos" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Nuestro Equipo Médico</h2>
            <p className="text-gray-600 mt-2">Profesionales dedicados a tu cuidado.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {medicos.map((medico) => (
              <div key={medico.id} className="bg-gray-50 rounded-lg shadow-md overflow-hidden text-center transform hover:-translate-y-2 transition-transform">
                <img src={medico.fotoUrl} alt={`${medico.nombres} ${medico.apellidos}`} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900">{`${medico.nombres} ${medico.apellidos}`}</h4>
                  <p className="text-blue-600 font-medium">{medico.especialidad}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;