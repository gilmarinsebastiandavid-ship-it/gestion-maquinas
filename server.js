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
  // ==========================================
  // TABLA DE USUARIOS (compartida por todos los módulos)
  // ==========================================
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    rol TEXT NOT NULL,
    modulo TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // ==========================================
  // MÓDULO 1: DESPACHOS
  // ==========================================
  db.run(`CREATE TABLE IF NOT EXISTS despachos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    serie TEXT UNIQUE NOT NULL,
    modelo_maquina TEXT NOT NULL,
    cliente TEXT NOT NULL,
    valor REAL,
    factura TEXT,
    ciudad TEXT NOT NULL,
    logo TEXT NOT NULL,
    created_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // ==========================================
  // MÓDULO 2: SOLICITUDES
  // ==========================================
  db.run(`CREATE TABLE IF NOT EXISTS solicitudes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    unidades INTEGER NOT NULL,
    maquina TEXT NOT NULL,
    voltaje TEXT NOT NULL,
    cliente TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    logo TEXT NOT NULL,
    diseno_logo TEXT,
    estado TEXT NOT NULL,
    created_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // ==========================================
  // MÓDULO 3: PEDIDOS - Sistema de Productos
  // ==========================================
  
  // Tabla de Categorías
  db.run(`CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Tabla de Productos
  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
  )`);

  // Tabla de Pedidos (CON precio_unitario)
  db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad REAL NOT NULL,
    unidad TEXT NOT NULL,
    precio_unitario REAL DEFAULT 0,
    created_by TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
  )`);

  // Crear usuarios por defecto si no existen
  db.get("SELECT COUNT(*) as count FROM usuarios", (err, row) => {
    if (!err && row && row.count === 0) {
      const usuarios = [
        // Usuarios para DESPACHOS
        ['admin_despachos', 'admin123', 'administrador', 'despachos'],
        ['trabajador_despachos', 'trabajador123', 'trabajador', 'despachos'],
        
        // Usuarios para SOLICITUDES
        ['admin_solicitudes', 'admin123', 'administrador', 'solicitudes'],
        ['trabajador_solicitudes', 'trabajador123', 'trabajador', 'solicitudes'],
        
        // Usuarios para PEDIDOS
        ['admin_pedidos', 'admin123', 'administrador', 'pedidos'],
        ['trabajador_pedidos', 'trabajador123', 'trabajador', 'pedidos'],
        
        // Usuario super admin (acceso a todo)
        ['superadmin', 'super123', 'administrador', 'todos']
      ];

      usuarios.forEach(([username, password, rol, modulo]) => {
        db.run(
          "INSERT INTO usuarios (username, password, rol, modulo) VALUES (?, ?, ?, ?)",
          [username, password, rol, modulo],
          (err) => {
            if (err) {
              console.error(`Error creando usuario ${username}:`, err);
            } else {
              console.log(`✅ Usuario creado: ${username}`);
            }
          }
        );
      });
      
      console.log('✅ Proceso de creación de usuarios iniciado');
    }
  });

  // Crear categorías por defecto si no existen
  db.get("SELECT COUNT(*) as count FROM categorias", (err, row) => {
    if (!err && row && row.count === 0) {
      const categorias = [
        'Componentes Mecánicos',
        'Componentes Eléctricos',
        'Materiales Metálicos',
        'Elementos Hidráulicos',
        'Elementos Neumáticos',
        'Consumibles'
      ];

      categorias.forEach(nombre => {
        db.run("INSERT INTO categorias (nombre) VALUES (?)", [nombre], (err) => {
          if (err) {
            console.error(`Error creando categoría ${nombre}:`, err);
          } else {
            console.log(`✅ Categoría creada: ${nombre}`);
          }
        });
      });
      
      console.log('✅ Categorías por defecto creadas');
    }
  });
});

// ==========================================
// RUTAS DE AUTENTICACIÓN
// ==========================================
app.post('/api/login', (req, res) => {
  const { username, password, modulo } = req.body;
  
  db.get(
    `SELECT * FROM usuarios 
     WHERE username = ? AND password = ? 
     AND (modulo = ? OR modulo = 'todos')`, 
    [username, password, modulo],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: 'Error en el servidor' });
      } else if (row) {
        res.json({ 
          success: true, 
          usuario: { 
            id: row.id, 
            username: row.username, 
            rol: row.rol,
            modulo: row.modulo
          } 
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Credenciales incorrectas o sin acceso a este módulo' 
        });
      }
    }
  );
});

// ==========================================
// RUTAS MÓDULO 1: DESPACHOS
// ==========================================
app.get('/api/despachos', (req, res) => {
  db.all('SELECT * FROM despachos ORDER BY fecha DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener registros' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/despachos', (req, res) => {
  const { fecha, serie, modelo_maquina, cliente, valor, factura, ciudad, logo, created_by } = req.body;
  
  // Verificar si el serial ya existe
  db.get('SELECT id FROM despachos WHERE serie = ?', [serie], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al verificar serie' });
    }
    
    if (row) {
      return res.status(400).json({ 
        error: 'Serial duplicado',
        message: `El serial "${serie}" ya está registrado en el sistema` 
      });
    }
    
    // El serial no existe, proceder a insertar
    db.run(
      `INSERT INTO despachos (fecha, serie, modelo_maquina, cliente, valor, factura, ciudad, logo, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [fecha, serie, modelo_maquina, cliente, valor || null, factura || null, ciudad, logo, created_by],
      function(err) {
        if (err) {
          res.status(500).json({ error: 'Error al crear registro' });
        } else {
          res.json({ id: this.lastID, message: 'Registro creado exitosamente' });
        }
      }
    );
  });
});

app.put('/api/despachos/:id', (req, res) => {
  const { id } = req.params;
  const { fecha, serie, modelo_maquina, cliente, valor, factura, ciudad, logo } = req.body;
  
  // Verificar si el serial ya existe en otro registro
  db.get('SELECT id FROM despachos WHERE serie = ? AND id != ?', [serie, id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al verificar serie' });
    }
    
    if (row) {
      return res.status(400).json({ 
        error: 'Serial duplicado',
        message: `El serial "${serie}" ya está registrado en otro despacho` 
      });
    }
    
    // El serial no existe en otros registros, proceder a actualizar
    db.run(
      `UPDATE despachos 
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
      }
    );
  });
});

app.delete('/api/despachos/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM despachos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar registro' });
    } else {
      res.json({ message: 'Registro eliminado exitosamente' });
    }
  });
});

app.get('/api/despachos/exportar-csv', (req, res) => {
  db.all('SELECT * FROM despachos ORDER BY fecha DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al exportar' });
    } else {
      let csv = 'Fecha,Serie,Modelo de Máquina,Cliente,Valor,#Factura,Ciudad,Logo,Creado Por\n';
      rows.forEach(row => {
        csv += `${row.fecha},${row.serie},${row.modelo_maquina},${row.cliente},${row.valor || ''},${row.factura || ''},${row.ciudad},${row.logo},${row.created_by || ''}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=despachos.csv');
      res.send(csv);
    }
  });
});

// ==========================================
// RUTAS MÓDULO 2: SOLICITUDES
// ==========================================
app.get('/api/solicitudes', (req, res) => {
  db.all('SELECT * FROM solicitudes ORDER BY fecha DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener registros' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/solicitudes', (req, res) => {
  const { fecha, unidades, maquina, voltaje, cliente, ciudad, logo, diseno_logo, estado, created_by } = req.body;
  
  db.run(
    `INSERT INTO solicitudes (fecha, unidades, maquina, voltaje, cliente, ciudad, logo, diseno_logo, estado, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [fecha, unidades, maquina, voltaje, cliente, ciudad, logo, diseno_logo || null, estado, created_by],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al crear registro' });
      } else {
        res.json({ id: this.lastID, message: 'Solicitud creada exitosamente' });
      }
    }
  );
});

app.put('/api/solicitudes/:id', (req, res) => {
  const { id } = req.params;
  const { fecha, unidades, maquina, voltaje, cliente, ciudad, logo, diseno_logo, estado } = req.body;
  
  db.run(
    `UPDATE solicitudes 
     SET fecha = ?, unidades = ?, maquina = ?, voltaje = ?, cliente = ?, 
         ciudad = ?, logo = ?, diseno_logo = ?, estado = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [fecha, unidades, maquina, voltaje, cliente, ciudad, logo, diseno_logo || null, estado, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al actualizar registro' });
      } else {
        res.json({ message: 'Solicitud actualizada exitosamente' });
      }
    }
  );
});

app.delete('/api/solicitudes/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM solicitudes WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar registro' });
    } else {
      res.json({ message: 'Solicitud eliminada exitosamente' });
    }
  });
});

app.get('/api/solicitudes/exportar-csv', (req, res) => {
  db.all('SELECT * FROM solicitudes ORDER BY fecha DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al exportar' });
    } else {
      let csv = 'Fecha,Unidades,Máquina,Voltaje,Cliente,Ciudad,Logo,Diseño Logo,Estado,Creado Por\n';
      rows.forEach(row => {
        csv += `${row.fecha},${row.unidades},${row.maquina},${row.voltaje},${row.cliente},${row.ciudad},${row.logo},${row.diseno_logo || ''},${row.estado},${row.created_by || ''}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=solicitudes.csv');
      res.send(csv);
    }
  });
});

// ==========================================
// RUTAS MÓDULO 3: PEDIDOS - Gestión de Categorías
// ==========================================
app.get('/api/categorias', (req, res) => {
  db.all('SELECT * FROM categorias ORDER BY nombre ASC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener categorías' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/categorias', (req, res) => {
  const { nombre } = req.body;
  
  db.run('INSERT INTO categorias (nombre) VALUES (?)', [nombre], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error al crear categoría - Puede que ya exista' });
    } else {
      res.json({ id: this.lastID, message: 'Categoría creada exitosamente' });
    }
  });
});

app.put('/api/categorias/:id', (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  
  db.run('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error al actualizar categoría' });
    } else {
      res.json({ message: 'Categoría actualizada exitosamente' });
    }
  });
});

app.delete('/api/categorias/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM categorias WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar categoría - Puede tener productos asociados' });
    } else {
      res.json({ message: 'Categoría eliminada exitosamente' });
    }
  });
});

// ==========================================
// RUTAS MÓDULO 3: PEDIDOS - Gestión de Productos
// ==========================================
app.get('/api/productos', (req, res) => {
  const { categoria_id } = req.query;
  
  let query = `
    SELECT p.*, c.nombre as categoria_nombre 
    FROM productos p 
    JOIN categorias c ON p.categoria_id = c.id
  `;
  
  if (categoria_id) {
    query += ` WHERE p.categoria_id = ${categoria_id}`;
  }
  
  query += ' ORDER BY p.nombre ASC';
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener productos' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/productos', (req, res) => {
  const { nombre, categoria_id } = req.body;
  
  db.run(
    'INSERT INTO productos (nombre, categoria_id) VALUES (?, ?)',
    [nombre, categoria_id],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al crear producto' });
      } else {
        res.json({ id: this.lastID, message: 'Producto creado exitosamente' });
      }
    }
  );
});

app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, categoria_id } = req.body;
  
  db.run(
    'UPDATE productos SET nombre = ?, categoria_id = ? WHERE id = ?',
    [nombre, categoria_id, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al actualizar producto' });
      } else {
        res.json({ message: 'Producto actualizado exitosamente' });
      }
    }
  );
});

app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM productos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    } else {
      res.json({ message: 'Producto eliminado exitosamente' });
    }
  });
});

// ==========================================
// RUTAS MÓDULO 3: PEDIDOS - Gestión de Pedidos
// ==========================================
app.get('/api/pedidos', (req, res) => {
  db.all(`
    SELECT 
      ped.id,
      ped.fecha,
      ped.cantidad,
      ped.unidad,
      ped.precio_unitario,
      ped.created_by,
      ped.created_at,
      c.nombre as categoria_nombre,
      c.id as categoria_id,
      p.nombre as producto_nombre,
      p.id as producto_id
    FROM pedidos ped
    JOIN categorias c ON ped.categoria_id = c.id
    JOIN productos p ON ped.producto_id = p.id
    ORDER BY ped.fecha DESC, ped.id DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al obtener pedidos' });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/pedidos', (req, res) => {
  const { fecha, categoria_id, producto_id, cantidad, unidad, precio_unitario, created_by } = req.body;
  
  db.run(
    `INSERT INTO pedidos (fecha, categoria_id, producto_id, cantidad, unidad, precio_unitario, created_by) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [fecha, categoria_id, producto_id, cantidad, unidad, precio_unitario || 0, created_by],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al crear pedido' });
      } else {
        res.json({ id: this.lastID, message: 'Pedido creado exitosamente' });
      }
    }
  );
});

app.put('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const { fecha, categoria_id, producto_id, cantidad, unidad, precio_unitario } = req.body;
  
  db.run(
    `UPDATE pedidos 
     SET fecha = ?, categoria_id = ?, producto_id = ?, cantidad = ?, unidad = ?, precio_unitario = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [fecha, categoria_id, producto_id, cantidad, unidad, precio_unitario || 0, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: 'Error al actualizar pedido' });
      } else {
        res.json({ message: 'Pedido actualizado exitosamente' });
      }
    }
  );
});

app.delete('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM pedidos WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: 'Error al eliminar pedido' });
    } else {
      res.json({ message: 'Pedido eliminado exitosamente' });
    }
  });
});

app.get('/api/pedidos/exportar-csv', (req, res) => {
  db.all(`
    SELECT 
      ped.fecha,
      c.nombre as categoria,
      p.nombre as producto,
      ped.cantidad,
      ped.unidad,
      ped.precio_unitario,
      ped.created_by
    FROM pedidos ped
    JOIN categorias c ON ped.categoria_id = c.id
    JOIN productos p ON ped.producto_id = p.id
    ORDER BY ped.fecha DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Error al exportar' });
    } else {
      let csv = 'Fecha,Categoría,Producto,Cantidad,Unidad,Precio Unitario,Total,Creado Por\n';
      rows.forEach(row => {
        const total = (row.cantidad * row.precio_unitario).toFixed(2);
        csv += `${row.fecha},${row.categoria},${row.producto},${row.cantidad},${row.unidad},${row.precio_unitario || 0},${total},${row.created_by || ''}\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=pedidos.csv');
      res.send(csv);
    }
  });
});

// ==========================================
// RUTA PARA OBTENER ESTADÍSTICAS
// ==========================================
app.get('/api/estadisticas', (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as count FROM despachos', (err, row) => {
    stats.despachos = row ? row.count : 0;
    
    db.get('SELECT COUNT(*) as count FROM solicitudes', (err, row) => {
      stats.solicitudes = row ? row.count : 0;
      
      db.get('SELECT COUNT(*) as count FROM pedidos', (err, row) => {
        stats.pedidos = row ? row.count : 0;
        res.json(stats);
      });
    });
  });
});

// Servir el frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`✅ Servidor corriendo exitosamente`);
  console.log(`========================================`);
  console.log(`🌐 URL Local: http://localhost:${PORT}`);
  console.log(`📱 Acceso desde red: http://0.0.0.0:${PORT}`);
  console.log(`========================================`);
  console.log(`👤 Usuarios por defecto:`);
  console.log(`\n   📦 DESPACHOS:`);
  console.log(`      Admin: admin_despachos / admin123`);
  console.log(`      Trabajador: trabajador_despachos / trabajador123`);
  console.log(`\n   📋 SOLICITUDES:`);
  console.log(`      Admin: admin_solicitudes / admin123`);
  console.log(`      Trabajador: trabajador_solicitudes / trabajador123`);
  console.log(`\n   🚚 PEDIDOS:`);
  console.log(`      Admin: admin_pedidos / admin123`);
  console.log(`      Trabajador: trabajador_pedidos / trabajador123`);
  console.log(`\n   🌟 SUPER ADMIN (Todos los módulos):`);
  console.log(`      superadmin / super123`);
  console.log(`========================================`);
  console.log(`💡 Para detener el servidor: Ctrl+C`);
  console.log(`========================================\n`);
});