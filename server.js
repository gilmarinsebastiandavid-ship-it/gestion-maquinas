const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tablas
db.serialize(() => {
  // Tabla de usuarios
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT NOT NULL
  )`);

  // Tabla de registros
  db.run(`CREATE TABLE IF NOT EXISTS registros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    serie TEXT NOT NULL,
    modelo_maquina TEXT NOT NULL,
    cliente TEXT NOT NULL,
    valor REAL,
    factura TEXT,
    ciudad TEXT NOT NULL,
    logo TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Crear usuarios por defecto si no existen
  db.get("SELECT * FROM usuarios WHERE username = 'admin'", (err, row) => {
    if (!row) {
      db.run("INSERT INTO usuarios (username, password, rol) VALUES ('admin', 'admin123', 'administrador')");
      db.run("INSERT INTO usuarios (username, password, rol) VALUES ('trabajador', 'trabajador123', 'trabajador')");
      console.log('Usuarios por defecto creados');
    }
  });
});

// Rutas de autenticación
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get('SELECT * FROM usuarios WHERE username = ? AND password = ?', 
    [username, password], 
    (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Error en el servidor' });
      } else if (row) {
        res.json({ 
          success: true, 
          usuario: { 
            id: row.id, 
            username: row.username, 
            rol: row.rol 
          } 
        });
      } else {
        res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }
    });
});

// Rutas de registros
app.get('/api/registros', (req, res) => {
  db.all('SELECT * FROM registros ORDER BY fecha DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener registros' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/registros', (req, res) => {
  const { fecha, serie, modelo_maquina, cliente, valor, factura, ciudad, logo } = req.body;
  
  db.run(`INSERT INTO registros (fecha, serie, modelo_maquina, cliente, valor, factura, ciudad, logo) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [fecha, serie, modelo_maquina, cliente, valor || null, factura || null, ciudad, logo],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al crear registro' });
      } else {
        res.json({ id: this.lastID, message: 'Registro creado exitosamente' });
      }
    });
});

app.put('/api/registros/:id', (req, res) => {
  const { id } = req.params;
  const { fecha, serie, modelo_maquina, cliente, valor, factura, ciudad, logo } = req.body;
  
  db.run(`UPDATE registros 
          SET fecha = ?, serie = ?, modelo_maquina = ?, cliente = ?, 
              valor = ?, factura = ?, ciudad = ?, logo = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?`,
    [fecha, serie, modelo_maquina, cliente, valor || null, factura || null, ciudad, logo, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al actualizar registro' });
      } else {
        res.json({ message: 'Registro actualizado exitosamente' });
      }
    });
});

app.delete('/api/registros/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM registros WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar registro' });
    } else {
      res.json({ message: 'Registro eliminado exitosamente' });
    }
  });
});

// Exportar CSV
app.get('/api/exportar-csv', (req, res) => {
  db.all('SELECT * FROM registros ORDER BY fecha DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al exportar' });
    } else {
      let csv = 'Fecha,Serie,Modelo de Máquina,Cliente,Valor,#Factura,Ciudad,Logo\n';
      rows.forEach(row => {
        csv += `${row.fecha},${row.serie},${row.modelo_maquina},${row.cliente},${row.valor || ''},${row.factura || ''},${row.ciudad},${row.logo}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=registros.csv');
      res.send(csv);
    }
  });
});

// Servir el frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`Usuarios por defecto:`);
  console.log(`Admin - Usuario: admin, Contraseña: admin123`);
  console.log(`Trabajador - Usuario: trabajador, Contraseña: trabajador123`);
});