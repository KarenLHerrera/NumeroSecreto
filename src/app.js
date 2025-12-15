const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();

// Importar rutas
const tareasRoutes = require('./routes/tareasRoutes');

const PORT = process.env.PORT || 3000;
const PUNTAJES_FILE = path.join(__dirname, '..', 'data', 'puntajes.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/tareas', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admintareas.html'));
});

// Endpoint para obtener puntajes
app.get('/api/puntajes', async (req, res) => {
    try {
        const data = await fs.readFile(PUNTAJES_FILE, 'utf8');
        const puntajes = JSON.parse(data);
        res.json(puntajes);
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.json([]);
        } else {
            res.status(500).json({ error: 'Error al leer puntajes' });
        }
    }
});

// Endpoint para guardar puntaje
app.post('/api/puntajes', async (req, res) => {
    try {
        const { nombre, intentos } = req.body;
        
        if (!nombre || !intentos) {
            return res.status(400).json({ error: 'Nombre e intentos son requeridos' });
        }
        
        let puntajes = [];
        try {
            const data = await fs.readFile(PUNTAJES_FILE, 'utf8');
            puntajes = JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe, crear array vacío
            if (error.code !== 'ENOENT') throw error;
        }
        
        const nuevoPuntaje = {
            nombre,
            intentos,
            fecha: new Date().toISOString()
        };
        
        puntajes.push(nuevoPuntaje);
        
        // Crear directorio si no existe
        await fs.mkdir(path.dirname(PUNTAJES_FILE), { recursive: true });
        await fs.writeFile(PUNTAJES_FILE, JSON.stringify(puntajes, null, 2));
        
        res.status(201).json(nuevoPuntaje);
    } catch (error) {
        console.error('Error al guardar puntaje:', error);
        res.status(500).json({ error: 'Error al guardar puntaje' });
    }
});

// Rutas de tareas (CRUD)
app.use('/api/tareas', tareasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});