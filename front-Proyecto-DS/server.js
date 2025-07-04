import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============ CONFIGURACIÓN DEL PUERTO ============
const PORT = 3001; // Cambia aquí el puerto (3001, 8080, etc.)
// ===================================================

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Leer datos del archivo db.json
let db;
try {
  const dbPath = join(__dirname, 'db.json');
  const dbData = fs.readFileSync(dbPath, 'utf8');
  db = JSON.parse(dbData);
} catch (error) {
  console.error('Error al leer db.json:', error);
  process.exit(1);
}

// Función para guardar la base de datos en el archivo
const saveDb = () => {
  try {
    const dbPath = join(__dirname, 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error al guardar en db.json:', error);
  }
};

// Función para generar nuevo ID
const generateId = (collection) => {
  const ids = collection.map(item => item.id || item.idCita || item.idDiagnostico || item.idReceta || item.idRecomendacion || item.idResenia || item.idServicio || 1);
  return Math.max(...ids, 0) + 1;
};

// Función para crear endpoints CRUD
const createCrudEndpoints = (resource, apiPath) => {
  const resourcePath = apiPath || `/api/${resource}`;
  
  // GET all
  app.get(resourcePath, (req, res) => {
    res.json(db[resource] || []);
  });

  // GET by id
  app.get(`${resourcePath}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const item = db[resource]?.find(item => 
      (item.id === id) || 
      (item.idCita === id) || 
      (item.idDiagnostico === id) || 
      (item.idReceta === id) || 
      (item.idRecomendacion === id) || 
      (item.idResenia === id) || 
      (item.idServicio === id)
    );
    
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Recurso no encontrado' });
    }
  });

  // POST create
  app.post(resourcePath, (req, res) => {
    const newItem = {
      ...req.body,
      id: generateId(db[resource] || [])
    };
    
    if (!db[resource]) db[resource] = [];
    db[resource].push(newItem);
    saveDb();
    res.status(201).json(newItem);
  });

  // PATCH update
  app.patch(`${resourcePath}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = db[resource]?.findIndex(item => 
      (item.id === id) || 
      (item.idCita === id) || 
      (item.idDiagnostico === id) || 
      (item.idReceta === id) || 
      (item.idRecomendacion === id) || 
      (item.idResenia === id) || 
      (item.idServicio === id)
    );
    
    if (itemIndex !== -1) {
      db[resource][itemIndex] = { ...db[resource][itemIndex], ...req.body };
      saveDb();
      res.json(db[resource][itemIndex]);
    } else {
      res.status(404).json({ error: 'Recurso no encontrado' });
    }
  });

  // DELETE
  app.delete(`${resourcePath}/:id`, (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = db[resource]?.findIndex(item => 
      (item.id === id) || 
      (item.idCita === id) || 
      (item.idDiagnostico === id) || 
      (item.idReceta === id) || 
      (item.idRecomendacion === id) || 
      (item.idResenia === id) || 
      (item.idServicio === id)
    );
    
    if (itemIndex !== -1) {
      const deletedItem = db[resource].splice(itemIndex, 1)[0];
      saveDb();
      res.json(deletedItem);
    } else {
      res.status(404).json({ error: 'Recurso no encontrado' });
    }
  });

  // POST filter
  app.post(`${resourcePath}/filter`, (req, res) => {
    const filters = req.body;
    let filteredData = db[resource] || [];
    
    // Aplicar filtros básicos
    Object.keys(filters).forEach(key => {
      filteredData = filteredData.filter(item => 
        item[key] && item[key].toString().toLowerCase().includes(filters[key].toString().toLowerCase())
      );
    });
    
    res.json(filteredData);
  });
};

// Crear endpoints para todas las entidades
createCrudEndpoints('citas');
createCrudEndpoints('consultorios');
createCrudEndpoints('detalle-pagos');
createCrudEndpoints('diagnosticos');
createCrudEndpoints('especialidades');
createCrudEndpoints('horario_Doctor');
createCrudEndpoints('personas');
createCrudEndpoints('recetas');
createCrudEndpoints('recomendaciones');
createCrudEndpoints('resenias');
createCrudEndpoints('servicios');
createCrudEndpoints('usuarios');

// Permisos sin /api
createCrudEndpoints('permisos', '/permisos');

// Endpoint raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Habimed Mock API',
    version: '1.0.0',
    endpoints: {
      citas: `http://localhost:${PORT}/api/citas`,
      usuarios: `http://localhost:${PORT}/api/usuarios`,
      consultorios: `http://localhost:${PORT}/api/consultorios`,
      permisos: `http://localhost:${PORT}/permisos`,
      // ... otros endpoints
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n🚀 Habimed Mock API está corriendo!');
  console.log(`📍 Servidor: http://localhost:${PORT}`);
  console.log('\n📋 Endpoints disponibles:');
  console.log(`   GET    http://localhost:${PORT}/api/citas`);
  console.log(`   POST   http://localhost:${PORT}/api/citas`);
  console.log(`   GET    http://localhost:${PORT}/api/citas/:id`);
  console.log(`   PATCH  http://localhost:${PORT}/api/citas/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/citas/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/citas/filter`);
  console.log('');
  console.log(`   GET    http://localhost:${PORT}/api/usuarios`);
  console.log(`   POST   http://localhost:${PORT}/api/usuarios`);
  console.log(`   GET    http://localhost:${PORT}/api/usuarios/:id`);
  console.log(`   PATCH  http://localhost:${PORT}/api/usuarios/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/usuarios/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/usuarios/filter`);
  console.log('');
  console.log(`   GET    http://localhost:${PORT}/api/consultorios`);
  console.log(`   GET    http://localhost:${PORT}/api/especialidades`);
  console.log(`   GET    http://localhost:${PORT}/api/servicios`);
  console.log(`   GET    http://localhost:${PORT}/api/personas`);
  console.log(`   GET    http://localhost:${PORT}/api/diagnosticos`);
  console.log(`   GET    http://localhost:${PORT}/api/recetas`);
  console.log(`   GET    http://localhost:${PORT}/api/recomendaciones`);
  console.log(`   GET    http://localhost:${PORT}/api/resenias`);
  console.log(`   GET    http://localhost:${PORT}/api/detalle-pagos`);
  console.log(`   GET    http://localhost:${PORT}/api/horario_Doctor`);
  console.log('');
  console.log(`   GET    http://localhost:${PORT}/permisos (sin /api)`);
  console.log('');
  console.log('💡 Todos los endpoints soportan GET, POST, PATCH, DELETE y /filter');
  console.log('💡 Para cambiar el puerto, modifica la variable PORT en server.js');
  console.log('\n✅ Mock API lista para usar!');
});

// Manejo de errores
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor...');
  process.exit(0);
});