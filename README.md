# 🚀 Sistema de Gestión de Máquinas - Guía Completa

## 📖 Índice
1. [Descripción del Sistema](#descripción-del-sistema)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación desde Cero](#instalación-desde-cero)
4. [Configuración del Proyecto](#configuración-del-proyecto)
5. [Estructura de Archivos](#estructura-de-archivos)
6. [Iniciar el Servidor](#iniciar-el-servidor)
7. [Módulos del Sistema](#módulos-del-sistema)
8. [Configuración de Tailscale](#configuración-de-tailscale)
9. [Acceso desde Dispositivos](#acceso-desde-dispositivos)
10. [Crear Acceso Directo (PWA)](#crear-acceso-directo-pwa)
11. [Usuarios del Sistema](#usuarios-del-sistema)
12. [Backup y Mantenimiento](#backup-y-mantenimiento)
13. [Solución de Problemas](#solución-de-problemas)
14. [Comandos Rápidos](#comandos-rápidos)

---

## 🎯 Descripción del Sistema

Sistema completo de gestión empresarial con **3 módulos independientes**:

### ✅ Características Generales:
- **Backend**: Node.js + Express
- **Base de datos**: SQLite (un solo archivo)
- **Frontend**: Páginas HTML responsive (móvil y PC)
- **Sistema de usuarios**: Administrador / Trabajador por módulo
- **CRUD completo**: Crear, Leer, Actualizar, Eliminar
- **Exportar CSV**: Disponible para administradores
- **Acceso remoto**: Seguro vía Tailscale VPN

### 📦 Módulos Disponibles:

#### 1. **Despachos** (`despachos.html`)
Gestión de despachos de máquinas con:
- Fecha de despacho
- Serie de la máquina (única, no se puede repetir)
- Modelo de máquina
- Cliente
- Ciudad (33 ciudades colombianas + opción personalizada)
- Logo (Sí/No)
- **Solo Administrador ve**: Valor y #Factura

#### 2. **Solicitudes** (`solicitudes.html`)
Control de solicitudes de fabricación:
- Fecha de solicitud
- Unidades solicitadas
- Máquina (tipo/modelo)
- Voltaje
- Cliente
- Ciudad (33 ciudades colombianas + opción personalizada)
- Logo (Sí/No)
- Diseño del logo (si requiere logo)
- Estado (Pendiente, En Proceso, Aprobado, Rechazado, Completado, Préstamo)

#### 3. **Pedidos** (`pedidos.html`)
Gestión de pedidos de materia prima:
- Sistema de **Categorías y Productos** (totalmente personalizable)
- Fecha del pedido
- Cantidad y Unidad (Kg, Gramos, Litros, Unidades, Cajas, Metros, etc.)
- **Solo Administrador ve**: Precio unitario y totales
- **Gestión de Categorías**: Crear, editar, eliminar categorías
- **Gestión de Productos**: Crear, editar, eliminar productos por categoría
- Historial agrupado por fecha

**Arquitectura:**
```
┌─────────────────────────────────────┐
│  Servidor (Tu PC)                   │
│  ├── Node.js (Backend)              │
│  ├── SQLite (Base de Datos)         │
│  └── HTML (Páginas Web)             │
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
│  URLs:                       │
│  - http://100.64.1.10:3000   │
│  - http://100.64.1.10:3000/despachos.html  │
│  - http://100.64.1.10:3000/solicitudes.html│
│  - http://100.64.1.10:3000/pedidos.html    │
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

Necesitas crear **6 archivos en total**. Usa cualquier editor de texto.

#### **Archivo 1: package.json**
**Ubicación:** `sistema-gestion/package.json`

```json
{
  "name": "sistema-gestion-maquinas",
  "version": "3.0.0",
  "description": "Sistema de gestión de máquinas con 3 módulos independientes",
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

**Nota:** Este es el archivo del backend que ya tienes en el documento original. Cópialo exactamente como está.

---

#### **Archivos 3-6: Páginas HTML**
**Ubicación:** `sistema-gestion/public/`

Copia cada archivo HTML exactamente como te los proporcioné:

1. **`public/index.html`** - Menú principal con 3 módulos
2. **`public/despachos.html`** - Módulo de despachos
3. **`public/solicitudes.html`** - Módulo de solicitudes
4. **`public/pedidos.html`** - Módulo de pedidos

---

## 📁 Estructura de Archivos

Tu carpeta debe verse así:

```
sistema-gestion/
├── package.json              ← Dependencias del proyecto
├── server.js                 ← Backend (Node.js + Express)
├── database.db              ← Base de datos (se crea automáticamente)
└── public/
    ├── index.html           ← Menú principal
    ├── despachos.html       ← Módulo 1: Despachos
    ├── solicitudes.html     ← Módulo 2: Solicitudes
    └── pedidos.html         ← Módulo 3: Pedidos
```

**Verifica en tu explorador de archivos que todo esté en su lugar.**

---

### Paso 3: Instalar Dependencias

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

### Inicio Manual (Para Uso Normal)

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
   📦 DESPACHOS:
      Admin: admin_despachos / admin123
      Trabajador: trabajador_despachos / trabajador123
   
   📋 SOLICITUDES:
      Admin: admin_solicitudes / admin123
      Trabajador: trabajador_solicitudes / trabajador123
   
   🚚 PEDIDOS:
      Admin: admin_pedidos / admin123
      Trabajador: trabajador_pedidos / trabajador123
   
   🌟 SUPER ADMIN (Todos los módulos):
      superadmin / super123
========================================
💡 Para detener el servidor: Ctrl+C
========================================
```

**Probar que funciona:**
1. Abre tu navegador
2. Ve a: `http://localhost:3000`
3. Deberías ver el **Menú Principal** con 3 módulos

**Para detener el servidor:**
- Presiona `Ctrl+C` en la terminal

---

## 📚 Módulos del Sistema

### 🏠 Menú Principal (`index.html`)

**URL:** `http://localhost:3000` o `http://TU_IP_TAILSCALE:3000`

**Características:**
- Muestra 3 tarjetas con los módulos disponibles
- Estadísticas en tiempo real (total de registros por módulo)
- Actualización automática cada 30 segundos
- Diseño responsive (funciona en móvil y PC)

**Navegación:**
- Haz clic en cualquier tarjeta para acceder al módulo
- Cada módulo tiene su propio login independiente

---

### 📦 Módulo 1: Despachos (`despachos.html`)

**URL:** `http://localhost:3000/despachos.html`

**Login:**
- **Administrador**: `admin_despachos` / `admin123`
- **Trabajador**: `trabajador_despachos` / `trabajador123`

**Campos del Formulario:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Fecha | Fecha | ✅ Sí | Fecha del despacho |
| Serie | Texto | ✅ Sí | Número de serie **único** (no se puede repetir) |
| Modelo de Máquina | Texto | ✅ Sí | Modelo/tipo de máquina |
| Cliente | Texto | ✅ Sí | Nombre del cliente |
| Ciudad | Select | ✅ Sí | 33 ciudades colombianas + "Otra" |
| Logo | Select | ✅ Sí | Sí / No |
| **Valor** | Número | ❌ No | Solo visible para **Administrador** |
| **#Factura** | Texto | ❌ No | Solo visible para **Administrador** |

**Funcionalidades:**
- ✅ Crear nuevo despacho
- ✅ Editar despacho existente
- ✅ Eliminar despacho
- ✅ Validación de serie única (no permite duplicados)
- ✅ Exportar CSV (solo administrador)
- ✅ Campo "Otra ciudad" personalizado
- ✅ Botón "Menú Principal" para volver

**Permisos por Rol:**

| Función | Administrador | Trabajador |
|---------|---------------|------------|
| Ver Valor y #Factura | ✅ Sí | ❌ No |
| Exportar CSV | ✅ Sí | ❌ No |
| Crear registros | ✅ Sí | ✅ Sí |
| Editar registros | ✅ Sí | ✅ Sí |
| Eliminar registros | ✅ Sí | ✅ Sí |

---

### 📋 Módulo 2: Solicitudes (`solicitudes.html`)

**URL:** `http://localhost:3000/solicitudes.html`

**Login:**
- **Administrador**: `admin_solicitudes` / `admin123`
- **Trabajador**: `trabajador_solicitudes` / `trabajador123`

**Campos del Formulario:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Fecha | Fecha | ✅ Sí | Fecha de la solicitud |
| Unidades | Número | ✅ Sí | Cantidad de máquinas solicitadas |
| Máquina | Texto | ✅ Sí | Tipo/modelo de máquina |
| Voltaje | Texto | ✅ Sí | Especificación eléctrica (ej: 220V, 380V) |
| Cliente | Texto | ✅ Sí | Nombre del cliente |
| Ciudad | Select | ✅ Sí | 33 ciudades colombianas + "Otra" |
| Logo | Select | ✅ Sí | Sí / No |
| Diseño Logo | Texto | ⚠️ Condicional | Solo si Logo = "Sí" |
| Estado | Select | ✅ Sí | Ver tabla de estados abajo |

**Estados Disponibles:**

| Estado | Color | Descripción |
|--------|-------|-------------|
| Pendiente | Amarillo | Solicitud recibida, sin procesar |
| En Proceso | Azul | En fabricación/preparación |
| Aprobado | Verde | Solicitud aprobada |
| Rechazado | Rojo | Solicitud rechazada |
| Completado | Cyan | Solicitud finalizada |
| Préstamo | Dorado | Máquina en préstamo |

**Funcionalidades:**
- ✅ Crear nueva solicitud
- ✅ Editar solicitud existente
- ✅ Eliminar solicitud
- ✅ Campo "Diseño Logo" aparece solo si Logo = "Sí"
- ✅ Campo "Otra ciudad" personalizado
- ✅ Exportar CSV (solo administrador)
- ✅ Estados con colores distintivos
- ✅ Botón "Menú Principal" para volver

**Permisos por Rol:**

| Función | Administrador | Trabajador |
|---------|---------------|------------|
| Exportar CSV | ✅ Sí | ❌ No |
| Crear solicitudes | ✅ Sí | ✅ Sí |
| Editar solicitudes | ✅ Sí | ✅ Sí |
| Eliminar solicitudes | ✅ Sí | ✅ Sí |
| Cambiar estado | ✅ Sí | ✅ Sí |

---

### 🚚 Módulo 3: Pedidos (`pedidos.html`)

**URL:** `http://localhost:3000/pedidos.html`

**Login:**
- **Administrador**: `admin_pedidos` / `admin123`
- **Trabajador**: `trabajador_pedidos` / `trabajador123`

**Estructura del Módulo:**

El módulo de pedidos tiene **3 pestañas principales**:

#### **Pestaña 1: Nuevo Pedido**

Crear pedidos de materia prima:

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| Fecha | Fecha | ✅ Sí | Fecha del pedido |
| Categoría | Select | ✅ Sí | Categoría del producto |
| Producto | Select | ✅ Sí | Producto (se filtra por categoría) |
| Cantidad | Número | ✅ Sí | Cantidad solicitada |
| Unidad | Select | ✅ Sí | Kg, Gramos, Litros, Unidades, Cajas, Metros, etc. |
| **Precio/Unidad** | Número | ❌ No | Solo visible para **Administrador** |

**Unidades Disponibles:**
- Kg
- Gramos
- Litros
- Mililitros
- Unidades
- Cajas
- Paquetes
- Metros
- Pies
- Pulgadas

**Flujo de Trabajo:**
1. Selecciona la fecha
2. Selecciona una categoría
3. Selecciona un producto (se filtran por la categoría elegida)
4. Ingresa cantidad y unidad
5. Si eres **administrador**, puedes ingresar el precio unitario
6. Clic en "➕ Agregar al Pedido"
7. Repite para agregar más productos
8. Clic en "💾 Guardar Pedido" cuando termines

**Características Especiales:**
- ✅ Puedes agregar **múltiples productos** antes de guardar
- ✅ Se muestra una **tabla temporal** con los items agregados
- ✅ Puedes **eliminar items** antes de guardar
- ✅ Si eres **administrador**, ves el **total del pedido**
- ✅ Modo edición para modificar pedidos existentes

---

#### **Pestaña 2: Historial de Pedidos**

Ver todos los pedidos registrados:

**Vista:**
- Pedidos agrupados por fecha
- Tarjetas con información completa
- Lista de productos con cantidades
- Total del pedido (solo administrador)
- Botones de editar/eliminar (solo administrador)

**Funcionalidades:**
- ✅ Ver historial completo
- ✅ **Editar pedido** (solo administrador):
  - Clic en "✏️ Editar"
  - El pedido se carga en la pestaña "Nuevo Pedido"
  - Modifica los valores
  - Clic en "Guardar Pedido"
- ✅ **Eliminar pedido** (solo administrador)
- ✅ Exportar CSV (solo administrador)

---

#### **Pestaña 3: ⚙️ Gestionar Productos** (Solo Administrador)

Esta pestaña permite personalizar completamente el catálogo de productos.

**Sub-pestaña: Categorías**

Gestiona las categorías de productos:

| Acción | Descripción |
|--------|-------------|
| ➕ Nueva Categoría | Crear nueva categoría |
| ✏️ Editar | Modificar nombre de categoría |
| 🗑️ Eliminar | Eliminar categoría (y todos sus productos) |

**Categorías por Defecto:**
1. Componentes Mecánicos
2. Componentes Eléctricos
3. Materiales Metálicos
4. Elementos Hidráulicos
5. Elementos Neumáticos
6. Consumibles

**Sub-pestaña: Productos**

Gestiona los productos por categoría:

| Acción | Descripción |
|--------|-------------|
| ➕ Nuevo Producto | Crear producto asociado a una categoría |
| ✏️ Editar | Modificar nombre y/o categoría |
| 🗑️ Eliminar | Eliminar producto |

**Ejemplo de Flujo:**
1. Crear categoría "Tornillería"
2. Agregar productos:
   - Tornillo M8 x 50mm
   - Tuerca M8
   - Arandela plana M8
3. Ahora estos productos aparecen al crear un pedido

---

**Permisos por Rol - Módulo Pedidos:**

| Función | Administrador | Trabajador |
|---------|---------------|------------|
| Ver precio y totales | ✅ Sí | ❌ No |
| Editar pedidos | ✅ Sí | ❌ No |
| Eliminar pedidos | ✅ Sí | ❌ No |
| Gestionar categorías | ✅ Sí | ❌ No |
| Gestionar productos | ✅ Sí | ❌ No |
| Exportar CSV | ✅ Sí | ❌ No |
| Crear pedidos | ✅ Sí | ✅ Sí |
| Ver historial | ✅ Sí | ✅ Sí (sin precios) |

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

## 📱 Acceso desde Dispositivos

### Desde PC (misma máquina del servidor)

Abre tu navegador y ve a:
```
http://localhost:3000
```

O directamente a un módulo:
```
http://localhost:3000/despachos.html
http://localhost:3000/solicitudes.html
http://localhost:3000/pedidos.html
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
3. Verás el **Menú Principal** con los 3 módulos
4. Selecciona el módulo que necesites

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
3. Verás el **Menú Principal** con los 3 módulos
4. Selecciona el módulo que necesites

---

## 📲 Crear Acceso Directo (PWA)

Puedes agregar cada módulo a tu pantalla de inicio para que funcione como una app:

### iPhone/iPad

1. Abre Safari y ve a la URL del módulo que quieras:
   - Menú: `http://100.64.1.10:3000`
   - Despachos: `http://100.64.1.10:3000/despachos.html`
   - Solicitudes: `http://100.64.1.10:3000/solicitudes.html`
   - Pedidos: `http://100.64.1.10:3000/pedidos.html`
2. Toca el icono de **Compartir** (cuadrado con flecha hacia arriba)
3. Desliza y toca "**Añadir a pantalla de inicio**"
4. Cambia el nombre si quieres:
   - "Sistema Gestión"
   - "Despachos"
   - "Solicitudes"
   - "Pedidos"
5. Toca "**Añadir**"

**¡Listo!** Ahora tienes un icono que abre el módulo como una app.

---

### Android

1. Abre Chrome y ve a la URL del módulo
2. Toca el menú (⋮) en la esquina superior derecha
3. Toca "**Añadir a pantalla de inicio**"
4. Cambia el nombre si quieres
5. Toca "**Añadir**"

---

## 👤 Usuarios del Sistema

El sistema tiene **usuarios independientes por módulo** + un super administrador.

### 📦 Módulo Despachos

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin_despachos` | `admin123` | Administrador |
| `trabajador_despachos` | `trabajador123` | Trabajador |

**Acceso:** Solo puede entrar a `despachos.html`

---

### 📋 Módulo Solicitudes

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin_solicitudes` | `admin123` | Administrador |
| `trabajador_solicitudes` | `trabajador123` | Trabajador |

**Acceso:** Solo puede entrar a `solicitudes.html`

---

### 🚚 Módulo Pedidos

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `admin_pedidos` | `admin123` | Administrador |
| `trabajador_pedidos` | `trabajador123` | Trabajador |

**Acceso:** Solo puede entrar a `pedidos.html`

---

### 🌟 Super Administrador

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `superadmin` | `super123` | Administrador |

**Acceso:** Puede entrar a **TODOS los módulos** (despachos, solicitudes y pedidos)

---

### Diferencias entre Roles

#### **Administrador:**
- ✅ Ve todos los campos (incluyendo precios y valores)
- ✅ Puede exportar CSV
- ✅ Puede editar cualquier registro
- ✅ Puede eliminar registros
- ✅ Gestiona categorías y productos (en módulo Pedidos)
- ✅ Acceso completo a todas las funcionalidades

#### **Trabajador:**
- ✅ Puede crear registros
- ✅ Puede editar registros
- ✅ Puede eliminar registros
- ❌ NO ve campos de precios/valores
- ❌ NO puede exportar CSV
- ❌ NO puede gestionar categorías/productos

---

## 💾 Backup y Mantenimiento

### Hacer Backup de la Base de Datos

#### Método 1: Copiar el archivo (Recomendado)

```bash
# Windows
copy database.db database_backup_2025-11-21.db

# Mac/Linux
cp database.db database_backup_$(date +%Y-%m-%d).db
```

**Ubicación:** La base de datos `database.db` está en la carpeta raíz del proyecto (`sistema-gestion/`)

---

#### Método 2: Exportar a CSV (desde la aplicación)

**Por cada módulo:**

1. Inicia sesión como **administrador** en el módulo
2. Haz clic en "**📥 Exportar CSV**"
3. Guarda el archivo en un lugar seguro

**Archivos generados:**
- `despachos_2025-11-21.csv`
- `solicitudes_2025-11-21.csv`
- `pedidos_2025-11-21.csv`

---

### Restaurar un Backup

```bash
# Detener el servidor (Ctrl+C)

# Reemplazar la base de datos
# Windows
copy database_backup_2025-11-21.db database.db

# Mac/Linux
cp database_backup_2025-11-21.db database.db

# Reiniciar el servidor
npm start
```

---

### Backup Automático Programado

#### **Windows - Script .bat**

Crea un archivo `backup.bat`:

```batch
@echo off
cd C:\Users\TuUsuario\Documents\sistema-gestion
copy database.db backups\database_%date:~-4,4%%date:~-10,2%%date:~-7,2%.db
echo Backup realizado: %date% %time%
```

**Programar con Programador de Tareas:**
1. Abre "Programador de tareas" (Task Scheduler)
2. Crear tarea básica
3. Nombre: "Backup Sistema Gestión"
4. Desencadenador: Diariamente a las 2:00 AM
5. Acción: Iniciar programa → Selecciona `backup.bat`

---

#### **Mac/Linux - Script .sh**

Crea un archivo `backup.sh`:

```bash
#!/bin/bash
cd ~/Documents/sistema-gestion
mkdir -p backups
cp database.db backups/database_$(date +%Y%m%d_%H%M%S).db
echo "Backup realizado: $(date)"
```

```bash
# Hacer ejecutable
chmod +x backup.sh

# Programar con cron (ejecutar diario a las 2 AM)
crontab -e

# Agregar esta línea:
0 2 * * * /ruta/completa/a/backup.sh
```

---

### Limpieza de Backups Antiguos

**Recomendación:** Mantén solo los últimos 30 días de backups.

```bash
# Windows (PowerShell)
Get-ChildItem -Path "backups\database_*.db" | 
  Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | 
  Remove-Item

# Mac/Linux
find backups/ -name "database_*.db" -mtime +30 -delete
```

---

### Actualizar el Sistema

Si haces cambios en algún archivo HTML o en `server.js`:

```bash
# 1. Detener el servidor (Ctrl+C)

# 2. Hacer backup de la base de datos (opcional pero recomendado)
cp database.db database_backup_antes_actualizar.db

# 3. Reemplazar los archivos modificados

# 4. Reiniciar el servidor
npm start
```

---

### Cambiar Contraseñas de Usuario

#### Opción 1: Usar DB Browser (Interfaz Gráfica)

1. Descarga **DB Browser for SQLite**: https://sqlitebrowser.org/
2. Instala y abre el programa
3. **File → Open Database** → Selecciona `database.db`
4. Pestaña **"Browse Data"**
5. Tabla: **"usuarios"**
6. Haz doble clic en el campo `password` del usuario que quieras cambiar
7. Escribe la nueva contraseña
8. **Write Changes**
9. Cierra el programa

```bash
# Reinicia el servidor
npm start
```

---

#### Opción 2: Usar SQLite CLI

```bash
# Instalar SQLite
# Windows: Descarga desde https://www.sqlite.org/download.html
# Mac: brew install sqlite
# Linux: sudo apt install sqlite3

# Abrir la base de datos
sqlite3 database.db

# Ver usuarios actuales
SELECT id, username, rol, modulo FROM usuarios;

# Cambiar contraseña de un usuario específico
UPDATE usuarios SET password = 'nueva_contraseña' WHERE username = 'admin_despachos';

# Verificar cambios
SELECT username, password, rol FROM usuarios WHERE username = 'admin_despachos';

# Salir
.exit
```

```bash
# Reinicia el servidor
npm start
```

---

### Agregar Nuevos Usuarios

```bash
# Abrir base de datos
sqlite3 database.db

# Agregar nuevo usuario para Despachos
INSERT INTO usuarios (username, password, rol, modulo) 
VALUES ('juan_despachos', 'juan2025', 'trabajador', 'despachos');

# Agregar nuevo admin para Solicitudes
INSERT INTO usuarios (username, password, rol, modulo) 
VALUES ('maria_solicitudes', 'maria2025', 'administrador', 'solicitudes');

# Agregar usuario para Pedidos
INSERT INTO usuarios (username, password, rol, modulo) 
VALUES ('carlos_pedidos', 'carlos2025', 'trabajador', 'pedidos');

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
# En la terminal del servidor debe decir:
# "✅ Servidor corriendo exitosamente"
# Si no, ejecuta: npm start

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
2. Reinicia Tailscale en ambos dispositivos
3. Reinicia el servidor: `npm start`

---

### Problema: "Error: Cannot find module 'express'"

**Causa:** Las dependencias no están instaladas.

**Solución:**
```bash
cd sistema-gestion
npm install
npm start
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
npm start
```

**Mac/Linux:**
```bash
# Ver qué está usando el puerto
lsof -i :3000

# Matar el proceso
kill -9 PID_DEL_PROCESO

# Reiniciar
npm start
```

**O cambiar el puerto:**

Edita `server.js` línea 7:
```javascript
const PORT = 3001; // Cambia de 3000 a 3001
```

Ahora accede en: `http://100.64.1.10:3001`

---

### Problema: "Serial duplicado en Despachos"

**Causa:** Intentaste ingresar una serie que ya existe en la base de datos.

**Mensaje de error:**
```
❌ El serial "ABC123" ya está registrado en el sistema
```

**Solución:**
- Usa un número de serie diferente
- O edita el registro existente con ese serial

---

### Problema: "No veo los campos de Precio en Pedidos"

**Causa:** Iniciaste sesión como **trabajador**.

**Solución:**
1. Cierra sesión
2. Inicia sesión como **administrador**:
   - Usuario: `admin_pedidos`
   - Contraseña: `admin123`

---

### Problema: "No puedo editar pedidos en Historial"

**Causa:** Solo los **administradores** pueden editar pedidos desde el historial.

**Solución:**
- Inicia sesión como administrador
- O pide a un administrador que haga la edición

---

### Problema: "La pestaña Gestionar Productos no aparece"

**Causa:** Iniciaste sesión como **trabajador**.

**Solución:**
- Solo los **administradores** ven esta pestaña
- Inicia sesión como `admin_pedidos`

---

### Problema: "No puedo eliminar una categoría"

**Mensaje de error:**
```
❌ Error: Puede tener productos asociados
```

**Causa:** La categoría tiene productos asociados.

**Solución:**
1. Ve a la pestaña "Productos"
2. Elimina todos los productos de esa categoría
3. Vuelve a intentar eliminar la categoría

---

### Problema: "Error al guardar - DiseñoLogo requerido"

**Causa:** Seleccionaste Logo = "Sí" pero no escribiste el diseño.

**Solución:**
- Si Logo = "Sí", debes llenar el campo "Diseño del Logo"
- O cambia Logo a "No"

---

### Problema: "No puedo exportar CSV"

**Causa:** Necesitas ser **administrador**.

**Solución:**
1. Cierra sesión
2. Inicia sesión con usuario administrador del módulo correspondiente

---

### Problema: "CSV con caracteres raros (tildes)"

**Causa:** Excel no está leyendo correctamente UTF-8.

**Solución:**

**Método 1 - Abrir CSV correctamente en Excel:**
1. Abre Excel (hoja en blanco)
2. **Datos → Desde texto/CSV**
3. Selecciona el archivo
4. Origen del archivo: **65001: Unicode (UTF-8)**
5. Clic en "Cargar"

**Método 2 - Usar Google Sheets:**
1. Abre Google Sheets
2. **Archivo → Importar**
3. Selecciona el CSV
4. Se mostrará correctamente

---

### Problema: "La página se ve sin estilos"

**Causa:** El navegador tiene caché antigua.

**Solución:**
1. **Forzar recarga:**
   - Chrome/Edge/Firefox: `Ctrl+Shift+R` (Windows/Linux) o `Cmd+Shift+R` (Mac)
   - Safari: `Cmd+Option+R`

2. **Limpiar caché:**
   - Chrome: `Ctrl+Shift+Delete` → Limpiar caché
   - Safari: Ajustes → Safari → Limpiar historial

---

### Problema: "Base de datos corrupta"

**Síntomas:**
- Errores al guardar
- Datos que desaparecen
- El servidor no arranca

**Solución:**
```bash
# 1. Detener el servidor (Ctrl+C)

# 2. Verificar la base de datos
sqlite3 database.db "PRAGMA integrity_check;"

# 3. Si dice "ok", la DB está bien
# Si dice errores, restaurar backup:
cp database_backup_FECHA.db database.db

# 4. Reiniciar servidor
npm start
```

---

## 📋 Comandos Rápidos

### Servidor

```bash
# Iniciar servidor
npm start

# Detener servidor
Ctrl+C

# Ver si está corriendo (en otra terminal)
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000
```

---

### Tailscale

```bash
# Ver IP
tailscale ip -4

# Ver estado
tailscale status

# Conectar
tailscale up

# Desconectar
tailscale down

# Ver dispositivos conectados
tailscale status --peers
```

---

### Base de Datos

```bash
# Abrir base de datos
sqlite3 database.db

# Ver todas las tablas
.tables

# Ver usuarios
SELECT * FROM usuarios;

# Ver despachos
SELECT * FROM despachos;

# Ver solicitudes
SELECT * FROM solicitudes;

# Ver pedidos
SELECT * FROM pedidos;

# Ver categorías
SELECT * FROM categorias;

# Ver productos
SELECT * FROM productos;

# Contar registros por tabla
SELECT COUNT(*) FROM despachos;
SELECT COUNT(*) FROM solicitudes;
SELECT COUNT(*) FROM pedidos;

# Ver últimos 10 despachos
SELECT * FROM despachos ORDER BY fecha DESC LIMIT 10;

# Buscar por cliente
SELECT * FROM despachos WHERE cliente LIKE '%nombre%';

# Salir
.exit
```

---

### Backup

```bash
# Backup manual
# Windows
copy database.db backup\database_%date:~-4,4%%date:~-7,2%%date:~-10,2%.db

# Mac/Linux
cp database.db backups/database_$(date +%Y%m%d).db

# Restaurar backup
# Windows
copy backups\database_20251121.db database.db

# Mac/Linux
cp backups/database_20251121.db database.db
```

---

## 🎯 Flujo de Trabajo Recomendado

### Para Trabajadores

**Despachos:**
1. Accede a `http://IP:3000/despachos.html`
2. Login con `trabajador_despachos`
3. Clic en "➕ Nuevo Registro"
4. Llena: Fecha, Serie, Modelo, Cliente, Ciudad, Logo
5. Guardar

**Solicitudes:**
1. Accede a `http://IP:3000/solicitudes.html`
2. Login con `trabajador_solicitudes`
3. Clic en "➕ Nueva Solicitud"
4. Llena todos los campos
5. Selecciona estado inicial (generalmente "Pendiente")
6. Guardar

**Pedidos:**
1. Accede a `http://IP:3000/pedidos.html`
2. Login con `trabajador_pedidos`
3. Selecciona fecha
4. Agrega productos uno por uno
5. Cuando termines, clic en "💾 Guardar Pedido"

---

### Para Administradores

**Tareas Adicionales:**

1. **Revisar reportes:**
   - Exportar CSV mensualmente
   - Analizar datos en Excel/Google Sheets

2. **Gestionar productos (Pedidos):**
   - Crear nuevas categorías según necesidad
   - Agregar productos nuevos
   - Limpiar productos obsoletos

3. **Mantenimiento:**
   - Backup semanal de la base de datos
   - Verificar usuarios activos
   - Actualizar contraseñas cada 3-6 meses

4. **Editar/Corregir:**
   - Corregir errores en registros históricos
   - Actualizar precios en pedidos
   - Cambiar estados de solicitudes

---

## 🚀 Mejoras Futuras (Opcionales)

### Ideas para Expandir el Sistema:

1. **Búsqueda y Filtros:**
   - Buscar por cliente, fecha, ciudad
   - Filtrar por estado (solicitudes)
   - Ordenar por columnas

2. **Gráficas y Estadísticas:**
   - Gráfico de despachos por mes
   - Solicitudes por estado
   - Gastos en pedidos (administradores)

3. **Notificaciones:**
   - Alertas de solicitudes pendientes
   - Recordatorios de mantenimiento

4. **Fotos:**
   - Subir imágenes de las máquinas
   - Galería de diseños de logos

5. **Historial de Cambios:**
   - Ver quién modificó qué y cuándo
   - Auditoría completa

6. **Múltiples Sucursales:**
   - Filtrar por ubicación
   - Permisos por sucursal

7. **App Móvil Nativa:**
   - Versión para iOS/Android
   - Funcionar sin conexión (offline)

8. **Integraciones:**
   - Sincronizar con sistemas contables
   - Enviar facturas por email
   - WhatsApp notifications

---

## 📞 Soporte y Contacto

### Si tienes problemas:

1. **Revisa esta documentación** primero
2. **Verifica los logs** del servidor en la terminal
3. **Prueba en modo incógnito** para descartar problemas de caché
4. **Revisa la base de datos** con DB Browser

### Logs Útiles:

```bash
# Ver qué está pasando en tiempo real
# (Mantén esto abierto mientras pruebas)

# Terminal donde corre el servidor mostrará:
# - Peticiones HTTP
# - Errores de la base de datos
# - Problemas de autenticación
```

---

## 📚 Recursos Adicionales

- **Node.js Docs:** https://nodejs.org/docs/
- **Express Guide:** https://expressjs.com/en/guide/routing.html
- **SQLite Tutorial:** https://www.sqlitetutorial.net/
- **Tailscale Docs:** https://tailscale.com/kb/
- **HTML/CSS/JS:** https://developer.mozilla.org/

---

## 🎉 ¡Felicidades!

Si completaste todos los pasos, ahora tienes:

✅ Sistema completo con 3 módulos independientes
✅ Menú principal con estadísticas
✅ Accesible desde PC, iPhone, Android
✅ Servidor corriendo 24/7
✅ Acceso remoto seguro con Tailscale
✅ Base de datos SQLite persistente
✅ Sistema de usuarios por módulo
✅ Exportación a CSV
✅ Gestión completa de productos (Pedidos)
✅ Validación de series únicas (Despachos)
✅ Estados con colores (Solicitudes)

**¡Tu sistema está listo para producción!** 🚀

---

## 📝 Registro de Cambios

### Versión 3.0.0 (2025-11-21)
- ✅ Sistema modular con 3 módulos independientes
- ✅ Menú principal con navegación
- ✅ Módulo de Despachos completo
- ✅ Módulo de Solicitudes completo
- ✅ Módulo de Pedidos con gestión de categorías/productos
- ✅ Usuarios independientes por módulo
- ✅ Super administrador con acceso total
- ✅ Validación de series únicas en Despachos
- ✅ Campo "Otra ciudad" personalizable
- ✅ Exportación CSV con UTF-8 correcto
- ✅ Diseño responsive para móvil
- ✅ Documentación completa actualizada

---

**Desarrollado con ❤️ para gestión empresarial eficiente**

**Sistema de Gestión v3.0 | © 2025**