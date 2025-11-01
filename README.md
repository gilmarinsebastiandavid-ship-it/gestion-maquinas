# 🚀 Sistema de Gestión de Máquinas - Guía Completa

## 📖 Índice
1. [Descripción del Sistema](#descripción-del-sistema)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación desde Cero](#instalación-desde-cero)
4. [Configuración del Proyecto](#configuración-del-proyecto)
5. [Iniciar el Servidor](#iniciar-el-servidor)
6. [PM2 - Mantener Servidor 24/7](#pm2---mantener-servidor-247)
7. [Configuración de Tailscale](#configuración-de-tailscale)
8. [Acceso desde Dispositivos](#acceso-desde-dispositivos)
9. [Crear Acceso Directo (PWA)](#crear-acceso-directo-pwa)
10. [Backup y Mantenimiento](#backup-y-mantenimiento)
11. [Solución de Problemas](#solución-de-problemas)
12. [Comandos Rápidos](#comandos-rápidos)

---

## 🎯 Descripción del Sistema

Sistema completo de gestión de máquinas con:
- ✅ Backend Node.js + Express
- ✅ Base de datos SQLite
- ✅ Página web responsive (funciona en móvil y PC)
- ✅ Sistema de usuarios (Administrador / Trabajador)
- ✅ CRUD completo (Crear, Leer, Actualizar, Eliminar)
- ✅ Exportar a CSV
- ✅ Acceso remoto seguro vía Tailscale VPN

**Arquitectura:**
```
┌─────────────────────────────────────┐
│  Servidor (Tu PC)                   │
│  ├── Node.js (Backend)              │
│  ├── SQLite (Base de Datos)         │
│  └── HTML (Página Web)              │
│                                     │
│  Puerto: 3000                       │
│  IP Tailscale: 100.64.1.10          │
└─────────────────────────────────────┘
           ↓ ↓ ↓
    ┌──────┴──┴──────┐
    │   Tailscale VPN  │
    └──────┬──┬──────┘
           ↓ ↓ ↓
┌──────────┴──┴───────────────┐
│                              │
│  💻 PC (Navegador)          │
│  📱 iPhone (Safari)         │
│  📱 Android (Chrome)        │
│  💻 Laptop (Navegador)      │
│                              │
│  URL: http://100.64.1.10:3000 │
└──────────────────────────────┘
```

---

## 📋 Requisitos Previos

### Software Necesario:
- **Node.js 18 o superior** → https://nodejs.org/
- **Navegador web** (Chrome, Firefox, Safari, Edge)
- **Editor de texto** (Notepad++, VS Code, Sublime Text)

---

## 🔧 Instalación desde Cero

### Paso 1: Instalar Node.js

#### **Windows:**

1. Ve a https://nodejs.org/
2. Descarga la versión **LTS** (Long Term Support)
3. Ejecuta el instalador `.msi`
4. Durante la instalación:
   - ✅ Marca "Automatically install necessary tools"
   - ✅ Acepta agregar Node al PATH
5. Haz clic en "Next" hasta finalizar
6. Reinicia la computadora

**Verificar instalación:**
```bash
# Abre CMD (Símbolo del sistema) o PowerShell
# Presiona Win + R, escribe "cmd" y Enter

node --version
npm --version
```

Deberías ver algo como:
```
v20.10.0
10.2.3
```

---

#### **Mac:**

**Opción 1 - Instalador (Más fácil):**
1. Ve a https://nodejs.org/
2. Descarga el instalador `.pkg` para Mac
3. Ejecuta el archivo descargado
4. Sigue el asistente de instalación
5. Introduce tu contraseña cuando te la pida

**Opción 2 - Homebrew (Recomendado):**
```bash
# Abrir Terminal (Cmd + Espacio, escribe "Terminal")

# Si no tienes Homebrew, instálalo:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Node.js
brew install node

# Verificar
node --version
npm --version
```

---

#### **Linux (Ubuntu/Debian):**

```bash
# Abrir Terminal (Ctrl + Alt + T)

# Actualizar repositorios
sudo apt update

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node --version
npm --version
```

---

### Paso 2: Verificar que NPM Funciona

```bash
# En cualquier terminal/CMD
npm --version
```

Si ves un número de versión, ¡todo está bien! ✅

**Si dice "npm no se reconoce como comando":**

**Windows:**
1. Cierra y vuelve a abrir CMD/PowerShell
2. Si persiste, reinstala Node.js asegurándote de marcar "Add to PATH"

**Mac/Linux:**
```bash
# Edita tu perfil
nano ~/.zshrc    # Mac con zsh
nano ~/.bashrc   # Linux o Mac con bash

# Agrega esta línea:
export PATH="/usr/local/bin:$PATH"

# Guarda (Ctrl+O, Enter, Ctrl+X)
# Recarga
source ~/.zshrc   # o source ~/.bashrc
```

---

## 📦 Configuración del Proyecto

### Paso 1: Crear la Estructura de Carpetas

#### **Windows (PowerShell o CMD):**
```bash
# Navegar a donde quieras crear el proyecto
cd C:\Users\TuUsuario\Documents

# Crear carpeta del proyecto
mkdir sistema-gestion
cd sistema-gestion

# Crear carpeta para archivos web
mkdir public
```

#### **Mac/Linux (Terminal):**
```bash
# Navegar a Documentos
cd ~/Documents

# Crear carpeta del proyecto
mkdir sistema-gestion
cd sistema-gestion

# Crear carpeta para archivos web
mkdir public
```

---

### Paso 2: Crear los Archivos del Proyecto

Necesitas crear 3 archivos. Usa cualquier editor de texto.

#### **Archivo 1: package.json**
**Ubicación:** `sistema-gestion/package.json`

Crea el archivo y copia este contenido:

```json
{
  "name": "sistema-gestion-maquinas",
  "version": "1.0.0",
  "description": "Sistema de gestión de máquinas con roles de usuario",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["express", "sqlite", "crud"],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "sqlite3": "^5.1.6",
    "body-parser": "^1.20.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

#### **Archivo 2: server.js**
**Ubicación:** `sistema-gestion/server.js`

```javascript
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
  console.log(`\n========================================`);
  console.log(`✅ Servidor corriendo exitosamente`);
  console.log(`========================================`);
  console.log(`🌐 URL Local: http://localhost:${PORT}`);
  console.log(`📱 Acceso desde red: http://0.0.0.0:${PORT}`);
  console.log(`========================================`);
  console.log(`👤 Usuarios por defecto:`);
  console.log(`   Admin: admin / admin123`);
  console.log(`   Trabajador: trabajador / trabajador123`);
  console.log(`========================================`);
  console.log(`💡 Para detener el servidor: Ctrl+C`);
  console.log(`========================================\n`);
});
```

---

#### **Archivo 3: index.html**
**Ubicación:** `sistema-gestion/public/index.html`

Este es el archivo del frontend completo que te proporcioné anteriormente. Copia el código completo del artifact "index.html - Frontend Completo".

---

### Paso 3: Verificar la Estructura

Tu carpeta debe verse así:

```
sistema-gestion/
├── package.json          ← Dependencias
├── server.js            ← Backend
└── public/
    └── index.html       ← Frontend
```

**Verifica en tu explorador de archivos que todo esté en su lugar.**

---

### Paso 4: Instalar Dependencias

Abre la terminal en la carpeta del proyecto:

#### **Windows:**
```bash
# Opción 1: Desde CMD
cd C:\Users\TuUsuario\Documents\sistema-gestion

# Opción 2: Desde el explorador
# - Navega a la carpeta sistema-gestion
# - Shift + Clic derecho en espacio vacío
# - "Abrir ventana de PowerShell aquí"

# Instalar
npm install
```

#### **Mac/Linux:**
```bash
cd ~/Documents/sistema-gestion
npm install
```

**Esto descargará todas las librerías necesarias.** Verás algo como:
```
added 57 packages, and audited 58 packages in 5s
```

Se creará una carpeta `node_modules/` - esto es normal y esperado.

---

## 🚀 Iniciar el Servidor

### Método 1: Inicio Manual (Para Pruebas)

```bash
# Asegúrate de estar en la carpeta del proyecto
cd sistema-gestion

# Iniciar servidor
npm start
```

**Deberías ver:**
```
========================================
✅ Servidor corriendo exitosamente
========================================
🌐 URL Local: http://localhost:3000
📱 Acceso desde red: http://0.0.0.0:3000
========================================
👤 Usuarios por defecto:
   Admin: admin / admin123
   Trabajador: trabajador / trabajador123
========================================
💡 Para detener el servidor: Ctrl+C
========================================
```

**Probar que funciona:**
1. Abre tu navegador
2. Ve a: `http://localhost:3000`
3. Deberías ver la pantalla de login

**Para detener el servidor:**
- Presiona `Ctrl+C` en la terminal

---

## 🔥 PM2 - Mantener Servidor 24/7

PM2 (Process Manager 2) es una herramienta que mantiene tu servidor corriendo siempre:

### ✅ Ventajas de PM2:
- ✅ Reinicia automáticamente si hay un error
- ✅ Se inicia al encender la computadora
- ✅ Logs automáticos de errores
- ✅ Monitoreo de memoria y CPU
- ✅ Puede manejar múltiples aplicaciones
- ✅ Reinicio automático al actualizar código

---

### Paso 1: Instalar PM2 Globalmente

```bash
npm install -g pm2
```

**Verificar instalación:**
```bash
pm2 --version
```

Deberías ver algo como: `5.3.0`

**Si dice "pm2 no se reconoce como comando":**

**Windows:**
```bash
# Cierra y abre una nueva terminal/CMD
# Si persiste, agrega npm a las variables de entorno:
# 1. Win + R → sysdm.cpl → Variables de entorno
# 2. En Path, agrega: C:\Users\TuUsuario\AppData\Roaming\npm
```

**Mac/Linux:**
```bash
# Agrega a tu PATH
echo 'export PATH="$PATH:~/.npm-global/bin"' >> ~/.zshrc
source ~/.zshrc

# O reinstala con sudo
sudo npm install -g pm2
```

---

### Paso 2: Iniciar el Servidor con PM2

```bash
# Ve a la carpeta del proyecto
cd sistema-gestion

# Inicia con PM2
pm2 start server.js --name "sistema-gestion"
```

**Deberías ver:**
```
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ status  │ restart │ uptime   │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ sistema-gestion  │ online  │ 0       │ 0s       │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

**¡Tu servidor está corriendo con PM2!** 🎉

---

### Paso 3: Guardar la Configuración

```bash
pm2 save
```

Esto guarda tu configuración para que PM2 recuerde tu aplicación.

---

### Paso 4: Configurar Auto-inicio al Encender PC

```bash
pm2 startup
```

PM2 te mostrará un comando específico para tu sistema. **Copia y ejecuta ese comando.**

**Ejemplo en Windows:**
```
[PM2] You have to run this command as administrator:
pm2 startup windows
```

**Ejemplo en Linux/Mac:**
```
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u tuusuario --hp /home/tuusuario
```

**Copia el comando que te muestre y ejecútalo.**

Después ejecuta de nuevo:
```bash
pm2 save
```

**¡Listo!** Ahora el servidor se iniciará automáticamente cada vez que enciendas tu PC.

---

### Comandos Útiles de PM2

```bash
# Ver estado de todas las aplicaciones
pm2 status

# Ver detalles de una aplicación
pm2 show sistema-gestion

# Ver logs en tiempo real
pm2 logs sistema-gestion

# Ver solo errores
pm2 logs sistema-gestion --err

# Reiniciar la aplicación
pm2 restart sistema-gestion

# Detener la aplicación
pm2 stop sistema-gestion

# Eliminar de PM2 (no borra archivos)
pm2 delete sistema-gestion

# Ver uso de recursos
pm2 monit

# Listar todas las apps
pm2 list

# Reiniciar después de cambios en el código
pm2 restart sistema-gestion --update-env

# Ver logs antiguos
pm2 logs sistema-gestion --lines 100
```

---

### Paso 5: Verificar que Funciona

```bash
# Ver el status
pm2 status
```

Debería mostrar:
```
┌─────┬──────────────────┬─────────┬─────────┬──────────┐
│ id  │ name             │ status  │ restart │ uptime   │
├─────┼──────────────────┼─────────┼─────────┼──────────┤
│ 0   │ sistema-gestion  │ online  │ 0       │ 5m       │
└─────┴──────────────────┴─────────┴─────────┴──────────┘
```

**Status: `online`** = ✅ Funcionando correctamente

---

### Actualizar el Código con PM2

Cuando hagas cambios en `server.js` o `index.html`:

```bash
# No necesitas detener PM2
# Solo reinicia la aplicación
pm2 restart sistema-gestion

# Ver que se reinició correctamente
pm2 logs sistema-gestion --lines 20
```

---

### Solución de Problemas con PM2

#### Problema: "PM2 no arranca al reiniciar PC"

**Solución:**
```bash
# Eliminar configuración antigua
pm2 unstartup

# Volver a configurar
pm2 startup
# Ejecuta el comando que te muestre

# Guardar
pm2 save
```

---

#### Problema: "La aplicación dice 'errored' o 'stopped'"

**Solución:**
```bash
# Ver los errores
pm2 logs sistema-gestion --err

# Reintentar inicio
pm2 restart sistema-gestion

# Si persiste, eliminar y volver a crear
pm2 delete sistema-gestion
pm2 start server.js --name "sistema-gestion"
pm2 save
```

---

#### Problema: "El servidor no responde después de cambios"

**Solución:**
```bash
# Hard restart
pm2 restart sistema-gestion --update-env

# Si no funciona, detener y volver a iniciar
pm2 stop sistema-gestion
pm2 start sistema-gestion
```

---

#### Problema: "Puerto 3000 ya está en uso"

**Solución:**
```bash
# Ver qué está usando el puerto 3000

# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000

# Detener proceso con PM2
pm2 stop sistema-gestion

# O matar el proceso manualmente
# Windows: taskkill /PID <numero_pid> /F
# Mac/Linux: kill -9 <pid>

# Reiniciar
pm2 start sistema-gestion
```

---

## 🌐 Configuración de Tailscale

Tailscale te permite acceder a tu servidor desde cualquier lugar de forma segura.

### Paso 1: Crear Cuenta

1. Ve a https://tailscale.com/
2. Haz clic en "Get Started"
3. Regístrate con:
   - Google
   - GitHub
   - Microsoft
   - Email

---

### Paso 2: Instalar Tailscale en el Servidor

#### **Windows:**
1. Ve a https://tailscale.com/download/windows
2. Descarga el instalador
3. Ejecuta el `.exe`
4. Sigue el asistente de instalación
5. Al terminar, haz clic en "Connect"
6. Se abrirá tu navegador
7. Inicia sesión con tu cuenta Tailscale
8. Autoriza el dispositivo

#### **Mac:**
1. Ve a https://tailscale.com/download/mac
2. Descarga el `.dmg`
3. Abre el archivo
4. Arrastra Tailscale a Aplicaciones
5. Abre Tailscale desde Aplicaciones
6. Haz clic en "Connect"
7. Inicia sesión en el navegador

#### **Linux:**
```bash
# Instalar
curl -fsSL https://tailscale.com/install.sh | sh

# Conectar
sudo tailscale up

# Se abrirá un enlace, cópialo y pégalo en tu navegador
# Inicia sesión y autoriza
```

---

### Paso 3: Obtener tu IP de Tailscale

```bash
tailscale ip -4
```

**Ejemplo de respuesta:**
```
100.64.1.10
```

**Anota esta IP, la necesitarás para conectarte desde otros dispositivos.**

---

### Paso 4: Verificar Estado

```bash
tailscale status
```

Deberías ver algo como:
```
100.64.1.10  mi-servidor     tu@email.com  online
```

---

### Paso 5: Permitir Subredes (Opcional pero Recomendado)

Esto permite que otros dispositivos en Tailscale accedan a tu servidor:

```bash
# Windows/Mac - Edita desde la app de Tailscale
# Linux:
sudo tailscale up --advertise-exit-node
```

---

## 📱 Acceso desde Dispositivos

### Desde PC (misma máquina del servidor)

Abre tu navegador y ve a:
```
http://localhost:3000
```

---

### Desde PC/Laptop en otra ubicación

1. Instala Tailscale en ese dispositivo
2. Conéctate con la misma cuenta
3. Abre el navegador y ve a:
```
http://100.64.1.10:3000
```
(Usa tu IP de Tailscale)

---

### Desde iPhone/iPad

#### Paso 1: Instalar Tailscale
1. Abre **App Store**
2. Busca "**Tailscale**"
3. Instala la app oficial
4. Abre Tailscale
5. Toca "**Get Started**"
6. Inicia sesión con tu cuenta
7. Autoriza la VPN
8. Verás "**Connected**" ✅

#### Paso 2: Acceder al Sistema
1. Abre **Safari** (o cualquier navegador)
2. Ve a: `http://100.64.1.10:3000`
3. ¡Listo! Verás el login

---

### Desde Android

#### Paso 1: Instalar Tailscale
1. Abre **Google Play Store**
2. Busca "**Tailscale**"
3. Instala la app oficial
4. Abre Tailscale
5. Toca "**Get Started**"
6. Inicia sesión con tu cuenta
7. Activa la VPN
8. Verás "**Connected**" ✅

#### Paso 2: Acceder al Sistema
1. Abre **Chrome** (o cualquier navegador)
2. Ve a: `http://100.64.1.10:3000`
3. ¡Listo! Verás el login

---

## 📲 Crear Acceso Directo (PWA)

Puedes agregar la página web a tu pantalla de inicio para que funcione como una app:

### iPhone/iPad

1. Abre Safari y ve a `http://100.64.1.10:3000`
2. Toca el icono de **Compartir** (cuadrado con flecha hacia arriba)
3. Desliza y toca "**Añadir a pantalla de inicio**"
4. Cambia el nombre si quieres: "**Sistema Gestión**"
5. Toca "**Añadir**"

**¡Listo!** Ahora tienes un icono en tu pantalla principal que abre el sistema como una app.

**Ventajas:**
- ✅ Abre en pantalla completa (sin barra de Safari)
- ✅ Icono personalizado
- ✅ Acceso rápido
- ✅ Se queda en segundo plano como app

---

### Android

1. Abre Chrome y ve a `http://100.64.1.10:3000`
2. Toca el menú (⋮) en la esquina superior derecha
3. Toca "**Añadir a pantalla de inicio**"
4. Cambia el nombre si quieres: "**Sistema Gestión**"
5. Toca "**Añadir**"

**¡Listo!** Ahora tienes un icono en tu pantalla principal.

---

## 💾 Backup y Mantenimiento

### Hacer Backup de la Base de Datos

#### Método 1: Copiar el archivo (Recomendado)

```bash
# Windows
copy database.db database_backup_2025-11-01.db

# Mac/Linux
cp database.db database_backup_$(date +%Y-%m-%d).db
```

#### Método 2: Exportar a CSV (desde la aplicación)

1. Inicia sesión como **administrador**
2. Haz clic en "**Exportar CSV**"
3. Guarda el archivo en un lugar seguro

---

### Restaurar un Backup

```bash
# Detener el servidor
pm2 stop sistema-gestion

# Reemplazar la base de datos
# Windows
copy database_backup_2025-11-01.db database.db

# Mac/Linux
cp database_backup_2025-11-01.db database.db

# Reiniciar el servidor
pm2 start sistema-gestion
```

---

### Actualizar el Sistema

Si haces cambios en el código:

```bash
# Reiniciar con PM2
pm2 restart sistema-gestion

# Ver que todo está bien
pm2 logs sistema-gestion
```

---

### Limpiar Logs de PM2

Los logs se acumulan con el tiempo. Límpielos periódicamente:

```bash
# Limpiar logs
pm2 flush

# O eliminar logs antiguos manualmente
pm2 logs sistema-gestion --lines 0
```

---

### Cambiar Contraseñas de Usuario

#### Opción 1: Usar SQLite Browser (Interfaz Gráfica)

1. Descarga DB Browser for SQLite: https://sqlitebrowser.org/
2. Abre el programa
3. "Open Database" → Selecciona `database.db`
4. Ve a la pestaña "Browse Data"
5. Selecciona la tabla "usuarios"
6. Haz doble clic en la contraseña que quieras cambiar
7. Escribe la nueva contraseña
8. "Write Changes"
9. Cierra el programa

```bash
# Reinicia el servidor
pm2 restart sistema-gestion
```

---

#### Opción 2: Usar SQLite CLI

```bash
# Instalar SQLite (si no lo tienes)
# Windows: Descarga desde https://www.sqlite.org/download.html
# Mac: brew install sqlite
# Linux: sudo apt install sqlite3

# Abrir la base de datos
sqlite3 database.db

# Ver usuarios actuales
SELECT * FROM usuarios;

# Cambiar contraseña del admin
UPDATE usuarios SET password = 'nueva_contraseña_admin' WHERE username = 'admin';

# Cambiar contraseña del trabajador
UPDATE usuarios SET password = 'nueva_contraseña_trabajador' WHERE username = 'trabajador';

# Verificar cambios
SELECT * FROM usuarios;

# Salir
.exit
```

```bash
# Reinicia el servidor
pm2 restart sistema-gestion
```

---

### Agregar Nuevos Usuarios

```bash
# Abrir base de datos
sqlite3 database.db

# Agregar nuevo usuario
INSERT INTO usuarios (username, password, rol) VALUES ('nuevo_usuario', 'contraseña123', 'trabajador');

# O agregar admin
INSERT INTO usuarios (username, password, rol) VALUES ('admin2', 'pass456', 'administrador');

# Ver todos los usuarios
SELECT * FROM usuarios;

# Salir
.exit
```

---

## 🐛 Solución de Problemas

### Problema: "No puedo acceder desde el móvil"

**Checklist de verificación:**
```bash
# 1. ¿El servidor está corriendo?
pm2 status
# Debe mostrar: status = online

# 2. ¿Tailscale está activo en el servidor?
tailscale status
# Debe mostrar: online

# 3. ¿Tailscale está activo en el móvil?
# Abre la app Tailscale, debe decir "Connected"

# 4. ¿Están en la misma red Tailscale?
# Ve a: https://login.tailscale.com/admin/machines
# Ambos dispositivos deben aparecer listados

# 5. ¿La URL es correcta?
# Debe ser: http://TU_IP_TAILSCALE:3000
# NO https, NO localhost
```

**Solución:**
1. Verifica cada punto del checklist
2. Reinicia Tailscale en ambos dispositivos:
   ```bash
   # Servidor
   tailscale down
   tailscale up
   
   # Móvil: Desconecta y vuelve a conectar desde la app
   ```
3. Reinicia el servidor:
   ```bash
   pm2 restart sistema-gestion
   ```

---

### Problema: "Error: Cannot find module 'express'"

**Causa:** Las dependencias no están instaladas.

**Solución:**
```bash
cd sistema-gestion
npm install
pm2 restart sistema-gestion
```

---

### Problema: "Puerto 3000 ya está en uso"

**Causa:** Hay otro proceso usando el puerto 3000.

**Solución:**

**Windows:**
```bash
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplaza PID con el número que aparece)
taskkill /PID 1234 /F

# Reiniciar
pm2 restart sistema-gestion
```

**Mac/Linux:**
```bash
# Ver qué está usando el puerto
lsof -i :3000

# Matar el proceso
kill -9 PID_DEL_PROCESO

# Reiniciar
pm2 restart sistema-gestion
```

**O cambiar el puerto:**

Edita `server.js` línea 7:
```javascript
const PORT = 3001; // Cambia de 3000 a 3001
```

```bash
pm2 restart sistema-gestion
```

Ahora accede en: `http://100.64.1.10:3001`

---

### Problema: "La base de datos está bloqueada"

**Causa:** Múltiples procesos intentando acceder a la base de datos.

**Solución:**
```bash
# Detener todo
pm2 stop sistema-gestion

# Esperar 5 segundos

# Volver a iniciar
pm2 start sistema-gestion
```

---

### Problema: "PM2 no se inicia al reiniciar el PC"

**Solución:**
```bash
# Eliminar startup antiguo
pm2 unstartup

# Configurar de nuevo
pm2 startup

# Ejecutar el comando que te muestre

# Guardar
pm2 save

# Reiniciar PC para probar
```

---

### Problema: "Tailscale dice 'Unable to authenticate'"

**Solución:**
1. Desinstala Tailscale completamente
2. Reinicia el PC
3. Vuelve a instalar Tailscale
4. Conecta de nuevo

---

### Problema: "No puedo exportar CSV"

**Causa:** Necesitas estar logueado como administrador.

**Solución:**
1. Cierra sesión
2. Inicia sesión con: `admin / admin123`
3. Ahora verás el botón "Exportar CSV"

---

### Problema: "Error al guardar registro"

**Checklist:**
- [ ] ¿Todos los campos obligatorios están llenos?
  - Fecha, Serie, Modelo, Cliente, Ciudad, Logo
- [ ] ¿El servidor está corriendo?
  ```bash
  pm2 status
  ```
- [ ] ¿Hay conexión a internet/Tailscale?

**Ver logs del error:**
```bash
pm2 logs sistema-gestion --err
```

---

### Problema: "La página web se ve rota o sin estilos"

**Causa:** El navegador cacheó una versión antigua.

**Solución:**
1. **Forzar recarga:**
   - Chrome/Edge/Firefox: `Ctrl+Shift+R` (Windows/Linux) o `Cmd+Shift+R` (Mac)
   - Safari: `Cmd+Option+R`

2. **Limpiar caché del navegador:**
   - Chrome: `Ctrl+Shift+Delete` → Limpiar caché
   - Safari: Ajustes → Safari → Limpiar historial y datos

3. **Modo incógnito:**
   - Abre una ventana incógnita/privada
   - Ve a la URL
   - Si funciona, el problema es el caché

---

### Problema: "No veo los campos Valor y #Factura"

**Eso es normal** si iniciaste sesión como **trabajador**.

Solo los **administradores** ven esos campos.

**Solución:** Inicia sesión con `admin / admin123`

---

## 📋 Comandos Rápidos

### Comandos de PM2

```bash
# Ver estado
pm2 status

# Iniciar
pm2 start sistema-gestion

# Detener
pm2 stop sistema-gestion

# Reiniciar
pm2 restart sistema-gestion

# Ver logs en tiempo real
pm2 logs sistema-gestion

# Ver logs de errores
pm2 logs sistema-gestion --err

# Limpiar logs
pm2 flush

# Eliminar de PM2
pm2 delete sistema-gestion

# Monitorear recursos
pm2 monit

# Guardar configuración
pm2 save

# Ver lista completa
pm2 list
```

---

### Comandos de Tailscale

```bash
# Ver IP
tailscale ip -4

# Ver estado
tailscale status

# Conectar
tailscale up

# Desconectar
tailscale down

# Ver máquinas conectadas
tailscale status --peers

# Hacer ping a otro dispositivo
tailscale ping 100.64.1.20
```

---

### Comandos de Base de Datos

```bash
# Abrir base de datos
sqlite3 database.db

# Ver todas las tablas
.tables

# Ver usuarios
SELECT * FROM usuarios;

# Ver registros
SELECT * FROM registros;

# Contar registros
SELECT COUNT(*) FROM registros;

# Ver últimos 10 registros
SELECT * FROM registros ORDER BY created_at DESC LIMIT 10;

# Salir
.exit
```

---

### Comandos de Backup

```bash
# Backup manual
# Windows
copy database.db backup\database_%date%.db

# Mac/Linux
cp database.db backup/database_$(date +%Y%m%d).db

# Restaurar backup
# Windows
copy backup\database_20251101.db database.db

# Mac/Linux
cp backup/database_20251101.db database.db
```

---

## 🎯 Flujo de Trabajo Diario

### Al empezar el día:

```bash
# 1. Verificar que el servidor está corriendo
pm2 status

# 2. Si está detenido, iniciarlo
pm2 start sistema-gestion

# 3. Ver los logs para verificar que todo está bien
pm2 logs sistema-gestion --lines 20
```

---

### Durante el día:

- Accede desde cualquier dispositivo: `http://100.64.1.10:3000`
- Todos los cambios se guardan automáticamente
- No necesitas hacer nada especial

---

### Al finalizar el día:

```bash
# 1. Hacer backup de la base de datos
cp database.db backups/database_$(date +%Y%m%d).db

# 2. Opcional: Ver estadísticas del día
pm2 show sistema-gestion

# El servidor sigue corriendo - PM2 lo mantiene activo 24/7
```

---

## 📊 Monitoreo y Estadísticas

### Ver uso de recursos

```bash
# Monitor en tiempo real
pm2 monit

# Ver memoria y CPU
pm2 show sistema-gestion
```

---

### Ver información del sistema

```bash
# Información completa
pm2 info sistema-gestion

# Ver uptime
pm2 status

# Ver logs históricos
pm2 logs sistema-gestion --lines 100
```

---

## 🔐 Seguridad

### Cambiar Contraseñas Periódicamente

**Recomendación:** Cambia las contraseñas cada 3-6 meses.

```bash
sqlite3 database.db
UPDATE usuarios SET password = 'nueva_contraseña_segura' WHERE username = 'admin';
.exit

pm2 restart sistema-gestion
```

---

### Backup Automático

Crea un script para hacer backups automáticos:

**Linux/Mac - `backup.sh`:**
```bash
#!/bin/bash
cd ~/sistema-gestion
cp database.db backups/database_$(date +%Y%m%d_%H%M%S).db
echo "Backup realizado: $(date)"
```

```bash
# Hacer ejecutable
chmod +x backup.sh

# Agregar a cron (ejecutar diario a las 2 AM)
crontab -e
# Agregar línea:
0 2 * * * /ruta/a/backup.sh
```

**Windows - `backup.bat`:**
```batch
@echo off
cd C:\ruta\sistema-gestion
copy database.db backups\database_%date:~-4,4%%date:~-10,2%%date:~-7,2%.db
echo Backup realizado: %date% %time%
```

Programar con Programador de Tareas de Windows (Task Scheduler).

---

## 📱 URLs de Acceso Rápido

Guarda estos enlaces para acceso rápido:

### Desde el servidor local:
```
http://localhost:3000
```

### Desde cualquier dispositivo con Tailscale:
```
http://100.64.1.10:3000
```
(Reemplaza con tu IP de Tailscale)

### Panel de administración de Tailscale:
```
https://login.tailscale.com/admin/machines
```

---

## ✅ Checklist de Verificación Completa

### Instalación Inicial:
- [ ] Node.js instalado (`node --version`)
- [ ] npm funciona (`npm --version`)
- [ ] Carpetas creadas (sistema-gestion/public)
- [ ] Archivos copiados (package.json, server.js, index.html)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Servidor funciona (`npm start`)
- [ ] Página web carga en `http://localhost:3000`

### PM2:
- [ ] PM2 instalado (`pm2 --version`)
- [ ] Servidor iniciado con PM2 (`pm2 start server.js`)
- [ ] Configuración guardada (`pm2 save`)
- [ ] Auto-inicio configurado (`pm2 startup`)
- [ ] Servidor aparece como "online" (`pm2 status`)

### Tailscale:
- [ ] Tailscale instalado en servidor
- [ ] Tailscale conectado en servidor
- [ ] IP de Tailscale obtenida (`tailscale ip -4`)
- [ ] Tailscale instalado en móvil
- [ ] Tailscale conectado en móvil
- [ ] Ambos dispositivos visibles en panel web

### Acceso:
- [ ] Puedo acceder desde PC: `http://localhost:3000`
- [ ] Puedo acceder desde móvil: `http://IP_TAILSCALE:3000`
- [ ] Login funciona (admin / admin123)
- [ ] Puedo crear registros
- [ ] Puedo editar registros
- [ ] Puedo eliminar registros
- [ ] Puedo exportar CSV (como admin)

### Backup:
- [ ] Primer backup creado
- [ ] Ubicación de backups definida
- [ ] Sé cómo restaurar un backup

---

## 🎓 Conceptos Importantes

### ¿Qué es Node.js?
Plataforma que permite ejecutar JavaScript en el servidor (fuera del navegador).

### ¿Qué es Express?
Framework que facilita crear servidores web con Node.js.

### ¿Qué es SQLite?
Base de datos que guarda todo en un solo archivo (`database.db`). No requiere servidor separado.

### ¿Qué es PM2?
Gestor de procesos que mantiene tu aplicación corriendo 24/7, la reinicia si falla, y la inicia al encender el PC.

### ¿Qué es Tailscale?
VPN que crea una red privada entre tus dispositivos. Permite acceder a tu servidor desde cualquier lugar de forma segura, sin abrir puertos.

### ¿Qué es localhost?
Dirección especial (127.0.0.1) que apunta a tu propia computadora.

### ¿Qué es un puerto?
Canal de comunicación. El puerto 3000 es donde nuestro servidor "escucha" las peticiones.

---

## 🚀 Próximos Pasos

Una vez que tengas todo funcionando:

### Mejoras Opcionales:
1. **PWA completa:** Agregar manifest.json para funcionamiento offline
2. **Búsqueda:** Filtrar registros por fecha, cliente, ciudad
3. **Gráficas:** Visualizar estadísticas de máquinas
4. **Fotos:** Subir imágenes de las máquinas
5. **Notificaciones:** Avisos de mantenimiento
6. **Multi-usuario:** Más roles y permisos
7. **Historial:** Ver quién modificó qué y cuándo

---

## 📞 Soporte

### Revisar Logs:
```bash
# Ver qué está pasando
pm2 logs sistema-gestion

# Ver solo errores
pm2 logs sistema-gestion --err

# Ver más líneas
pm2 logs sistema-gestion --lines 200
```

### Reinicio Completo:
```bash
# Si nada funciona, reinicio completo:
pm2 stop sistema-gestion
pm2 delete sistema-gestion
cd sistema-gestion
pm2 start server.js --name "sistema-gestion"
pm2 save
```

---

## 📚 Recursos Adicionales

- **Node.js:** https://nodejs.org/docs/
- **Express:** https://expressjs.com/
- **SQLite:** https://www.sqlite.org/docs.html
- **PM2:** https://pm2.keymetrics.io/docs/usage/quick-start/
- **Tailscale:** https://tailscale.com/kb/

---

## 🎉 ¡Felicidades!

Si llegaste hasta aquí y completaste todos los pasos, ahora tienes:

✅ Un sistema completo de gestión de máquinas
✅ Accesible desde PC, iPhone, Android
✅ Servidor corriendo 24/7 con PM2
✅ Acceso remoto seguro con Tailscale
✅ Base de datos persistente
✅ Sistema de backups
✅ Página web responsive

**¡Tu sistema está listo para usar en producción!** 🚀

---

## 📝 Registro de Cambios

### Versión 1.0.0 (2025-11-01)
- ✅ Sistema inicial completo
- ✅ Backend Node.js + Express
- ✅ Frontend HTML responsive
- ✅ Base de datos SQLite
- ✅ Autenticación con roles
- ✅ CRUD completo
- ✅ Exportar CSV
- ✅ Integración con Tailscale
- ✅ Configuración PM2
- ✅ Documentación completa

---

**Desarrollado con ❤️ para gestión eficiente de máquinas**