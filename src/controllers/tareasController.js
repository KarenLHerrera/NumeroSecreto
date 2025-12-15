const fs = require('fs').promises;
const path = require('path');

const TAREAS_FILE = path.join(__dirname, '..', '..', 'data', 'tareas.json');

// Leer tareas del archivo JSON
const leerTareas = async () => {
    try {
        const data = await fs.readFile(TAREAS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

// Escribir tareas al archivo JSON
const escribirTareas = async (tareas) => {
    await fs.mkdir(path.dirname(TAREAS_FILE), { recursive: true });
    await fs.writeFile(TAREAS_FILE, JSON.stringify(tareas, null, 2));
};

// GET - Obtener todas las tareas
const obtenerTareas = async (req, res) => {
    try {
        const tareas = await leerTareas();
        res.json(tareas);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({ error: 'Error al obtener tareas' });
    }
};

// GET - Obtener una tarea por ID
const obtenerTareaPorId = async (req, res) => {
    try {
        const tareas = await leerTareas();
        const tarea = tareas.find(t => t.id === parseInt(req.params.id));
        
        if (!tarea) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        
        res.json(tarea);
    } catch (error) {
        console.error('Error al obtener tarea:', error);
        res.status(500).json({ error: 'Error al obtener tarea' });
    }
};

// POST - Crear nueva tarea
const crearTarea = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        
        if (!titulo || !descripcion) {
            return res.status(400).json({ error: 'Título y descripción son requeridos' });
        }
        
        const tareas = await leerTareas();
        
        const nuevaTarea = {
            id: tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) + 1 : 1,
            titulo,
            descripcion,
            completada: false,
            fechaCreacion: new Date().toISOString()
        };
        
        tareas.push(nuevaTarea);
        await escribirTareas(tareas);
        
        res.status(201).json(nuevaTarea);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({ error: 'Error al crear tarea' });
    }
};

// PUT - Actualizar tarea
const actualizarTarea = async (req, res) => {
    try {
        const { titulo, descripcion, completada } = req.body;
        const id = parseInt(req.params.id);
        
        const tareas = await leerTareas();
        const index = tareas.findIndex(t => t.id === id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        
        tareas[index] = {
            ...tareas[index],
            titulo: titulo || tareas[index].titulo,
            descripcion: descripcion || tareas[index].descripcion,
            completada: completada !== undefined ? completada : tareas[index].completada,
            fechaModificacion: new Date().toISOString()
        };
        
        await escribirTareas(tareas);
        res.json(tareas[index]);
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        res.status(500).json({ error: 'Error al actualizar tarea' });
    }
};

// DELETE - Eliminar tarea
const eliminarTarea = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const tareas = await leerTareas();
        const index = tareas.findIndex(t => t.id === id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Tarea no encontrada' });
        }
        
        const tareaEliminada = tareas.splice(index, 1)[0];
        await escribirTareas(tareas);
        
        res.json({ message: 'Tarea eliminada exitosamente', tarea: tareaEliminada });
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({ error: 'Error al eliminar tarea' });
    }
};

module.exports = {
    obtenerTareas,
    obtenerTareaPorId,
    crearTarea,
    actualizarTarea,
    eliminarTarea
};
