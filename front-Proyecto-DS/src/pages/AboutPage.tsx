const AboutPage = () => {
  return (
    <div className="container mt-5 scrollable-container">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h1 className="mb-4 text-center">Quiénes Somos</h1>
          <img src="/HereDoctor/assets/img/about.jpg" alt="Nuestra clínica" className="img-fluid rounded mb-4" />
          <p>
            Bienvenido a HereDoctor, tu portal de salud de confianza. Nuestra misión es proporcionar acceso a una atención médica de calidad, conectando a pacientes con los mejores profesionales de la salud de una manera fácil y segura.
          </p>
          <p>
            Creemos en la importancia de la tecnología para mejorar la experiencia del paciente. Por eso, hemos desarrollado una plataforma intuitiva que te permite encontrar especialistas, agendar citas y recibir atención personalizada desde la comodidad de tu hogar.
          </p>
          <h2 className="mt-5 mb-3">Nuestro Equipo</h2>
          <p>
            Contamos con un equipo de médicos altamente calificados en diversas especialidades, comprometidos con tu bienestar. Nuestros profesionales son cuidadosamente seleccionados para garantizar que recibas la mejor atención posible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
