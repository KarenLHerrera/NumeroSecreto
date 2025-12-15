// Variables globales
let tareas = [];
let tareaEditando = null;

// Elementos del DOM
const formTarea = document.getElementById('formTarea');
const titulo = document.getElementById('titulo');
const descripcion = document.getElementById('descripcion');
const tareaId = document.getElementById('tareaId');
const listaTareas = document.getElementById('listaTareas');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const formTitle = document.getElementById('formTitle');

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarTareas();
});

// Evento submit del formulario
formTarea.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (tareaEditando) {
        await actualizarTarea();
    } else {
        await crearTarea();
    }
});

// Evento cancelar edición
btnCancelar.addEventListener('click', () => {
    cancelarEdicion();
});

// Cargar todas las tareas
async function cargarTareas() {
    try {
        const response = await fetch('/api/tareas');
        tareas = await response.json();
        mostrarTareas();
    } catch (error) {
        console.error('Error al cargar tareas:', error);
        alert('Error al cargar las tareas');
    }
}

// Mostrar tareas en la lista
function mostrarTareas() {
    listaTareas.innerHTML = '';
    
    if (tareas.length === 0) {
        listaTareas.innerHTML = '<p class="no-tareas">No hay tareas. ¡Crea una nueva!</p>';
        return;
    }
    
    tareas.forEach(tarea => {
        const tareaElement = document.createElement('div');
        tareaElement.className = `tarea-card ${tarea.completada ? 'completada' : ''}`;
        
        tareaElement.innerHTML = `
            <div class="tarea-header">
                <h3>${tarea.titulo}</h3>
                <input type="checkbox" class="checkbox-completada" ${tarea.completada ? 'checked' : ''} 
                    onchange="toggleCompletada(${tarea.id})">
            </div>
            <p class="tarea-descripcion">${tarea.descripcion}</p>
            <div class="tarea-info">
                <small>Creada: ${new Date(tarea.fechaCreacion).toLocaleDateString()}</small>
            </div>
            <div class="tarea-actions">
                <button class="btn-edit" onclick="editarTarea(${tarea.id})">✏️ Editar</button>
                <button class="btn-delete" onclick="eliminarTarea(${tarea.id})">🗑️ Eliminar</button>
            </div>
        `;
        
        listaTareas.appendChild(tareaElement);
    });
}

// Crear nueva tarea
async function crearTarea() {
    try {
        const response = await fetch('/api/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: titulo.value,
                descripcion: descripcion.value
            })
        });
        
        if (response.ok) {
            limpiarFormulario();
            await cargarTareas();
            alert('Tarea creada exitosamente');
        } else {
            alert('Error al crear la tarea');
        }
    } catch (error) {
        console.error('Error al crear tarea:', error);
        alert('Error al crear la tarea');
    }
}

// Editar tarea
function editarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;
    
    tareaEditando = id;
    titulo.value = tarea.titulo;
    descripcion.value = tarea.descripcion;
    tareaId.value = id;
    
    formTitle.textContent = 'Editar Tarea';
    btnGuardar.textContent = 'Actualizar Tarea';
    btnCancelar.style.display = 'inline-block';
    
    // Scroll al formulario
    formTarea.scrollIntoView({ behavior: 'smooth' });
}

// Actualizar tarea
async function actualizarTarea() {
    try {
        const response = await fetch(`/api/tareas/${tareaEditando}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titulo: titulo.value,
                descripcion: descripcion.value
            })
        });
        
        if (response.ok) {
            cancelarEdicion();
            await cargarTareas();
            alert('Tarea actualizada exitosamente');
        } else {
            alert('Error al actualizar la tarea');
        }
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        alert('Error al actualizar la tarea');
    }
}

// Eliminar tarea
async function eliminarTarea(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/tareas/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            await cargarTareas();
            alert('Tarea eliminada exitosamente');
        } else {
            alert('Error al eliminar la tarea');
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Error al eliminar la tarea');
    }
}

// Toggle completada
async function toggleCompletada(id) {
    const tarea = tareas.find(t => t.id === id);
    if (!tarea) return;
    
    try {
        const response = await fetch(`/api/tareas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completada: !tarea.completada
            })
        });
        
        if (response.ok) {
            await cargarTareas();
        } else {
            alert('Error al actualizar el estado de la tarea');
        }
    } catch (error) {
        console.error('Error al actualizar tarea:', error);
        alert('Error al actualizar el estado de la tarea');
    }
}

// Cancelar edición
function cancelarEdicion() {
    tareaEditando = null;
    limpiarFormulario();
    formTitle.textContent = 'Nueva Tarea';
    btnGuardar.textContent = 'Guardar Tarea';
    btnCancelar.style.display = 'none';
}

// Limpiar formulario
function limpiarFormulario() {
    titulo.value = '';
    descripcion.value = '';
    tareaId.value = '';
}
