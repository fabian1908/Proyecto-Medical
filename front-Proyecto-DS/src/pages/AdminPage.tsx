import { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const AdminPage = () => {
  const [entities] = useState([
    'citas', 'consultorios', 'detalle-pagos', 'diagnosticos', 
    'especialidades', 'horario_Doctor', 'personas', 'recetas', 
    'recomendaciones', 'resenias', 'servicios', 'usuarios'
  ]);
  const [selectedEntity, setSelectedEntity] = useState(entities[0]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const findIdKey = (item: any): string | undefined => {
    if (!item) return undefined;
    const keys = Object.keys(item);
    let idKey = keys.find(key => key.toLowerCase() === 'id');
    if (idKey) return idKey;
    idKey = keys.find(key => key.toLowerCase().endsWith('id'));
    return idKey;
  }

  useEffect(() => {
    fetchData(selectedEntity);
  }, [selectedEntity]);

  const fetchData = async (entity: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:3001/api/${entity}`);
      setData(response.data);
    } catch (err) {
      setError(`Error al cargar datos de ${entity}.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpen = (item: any | null = null) => {
    if (item) {
      setEditingItem({ ...item });
      setIsCreating(false);
    } else {
      const newItem = data.length > 0 ? Object.keys(data[0]).reduce((acc, key) => ({ ...acc, [key]: '' }), {}) : {};
      setEditingItem(newItem);
      setIsCreating(true);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingItem((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!editingItem) return;

    // Convertir valores a los tipos correctos antes de guardar
    const itemToSave = { ...editingItem };
    if (data.length > 0) {
      const sampleItem = data[0];
      Object.keys(itemToSave).forEach(key => {
        if (typeof sampleItem[key] === 'number') {
          itemToSave[key] = Number(itemToSave[key]);
        }
      });
    }

    try {
      if (isCreating) {
        await axios.post(`http://localhost:3001/api/${selectedEntity}`, itemToSave);
      } else {
        const idKey = findIdKey(itemToSave);
        if (!idKey || !itemToSave[idKey]) {
          alert("El item no tiene una clave de ID válida para poder actualizarlo.");
          return;
        }
        const id = itemToSave[idKey];
        await axios.patch(`http://localhost:3001/api/${selectedEntity}/${id}`, itemToSave);
      }
      fetchData(selectedEntity); // Siempre recargar los datos
      handleModalClose();
    } catch (err) {
      alert('Error al guardar los cambios.');
      console.error(err);
    }
  };

  const handleDelete = async (item: any) => {
    const idKey = findIdKey(item);
    if (!idKey || !item[idKey]) {
      alert("El item no tiene una clave de ID válida para poder eliminarlo.");
      return;
    }
    const id = item[idKey];
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      try {
        await axios.delete(`http://localhost:3001/api/${selectedEntity}/${id}`);
        fetchData(selectedEntity);
      } catch (err) {
        alert('Error al eliminar el registro.');
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Panel de Administración</h1>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="form-select w-25"
          >
            {entities.map(entity => (
              <option key={entity} value={entity} className="text-capitalize">{entity}</option>
            ))}
          </select>
        </div>

        <div className="card shadow">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h3 className="text-capitalize mb-0">{selectedEntity}</h3>
            <Button variant="primary" onClick={() => handleModalOpen()}>
              Añadir Nuevo
            </Button>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      {data.length > 0 && Object.keys(data[0]).map(key => (
                        <th key={key}>{key}</th>
                      ))}
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => {
                      const idKey = findIdKey(item);
                      const key = idKey ? item[idKey] : index;
                      return (
                        <tr key={key}>
                          {Object.values(item).map((value: any, i) => (
                            <td key={i}>{String(value)}</td>
                          ))}
                          <td className="text-end">
                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleModalOpen(item)}>
                              Editar
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item)}>
                              Eliminar
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={isModalOpen} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isCreating ? 'Añadir' : 'Editar'} <span className="text-capitalize">{selectedEntity}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingItem && Object.keys(editingItem).map((key) => {
            const idKey = findIdKey(editingItem);
            if (isCreating && key === idKey) {
              return null; // No mostrar el campo ID al crear
            }

            let inputField;
            const commonProps = {
              id: key,
              name: key,
              value: editingItem[key],
              onChange: handleInputChange,
              className: "form-control",
              disabled: key === idKey,
            };

            if (selectedEntity === 'usuarios' && key === 'tipoUsuarioId') {
              inputField = (
                <select {...commonProps}>
                  <option value="1">Paciente</option>
                  <option value="2">Doctor</option>
                  <option value="3">Admin</option>
                </select>
              );
            } else if (selectedEntity === 'usuarios' && key === 'estado') {
              inputField = (
                <select {...commonProps}>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                </select>
              );
            } else if (selectedEntity === 'resenias' && key === 'calificacion') {
              inputField = (
                <select {...commonProps}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              );
            } else if (key.toLowerCase().includes('hora')) {
              inputField = <input type="time" {...commonProps} />;
            } else {
              inputField = <input type="text" {...commonProps} />;
            }

            return (
              <div className="mb-3" key={key}>
                <label htmlFor={key} className="form-label text-capitalize">{key}</label>
                {inputField}
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminPage;
