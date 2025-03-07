# Proyecto de Gestión de Inventario y Clientes

## Descripción
Este proyecto es una aplicación desarrollada con **Ionic Angular** que permite la gestión de inventarios y clientes en un concesionario. Ofrece funcionalidades como:

- Visualización y filtrado de coches disponibles en el inventario.
- Gestión de usuarios con roles específicos.
- Compra de coches por parte de clientes autenticados.
- Historial de ventas para consultar coches comprados y su cliente asociado.

## Tecnologías Utilizadas

- **Framework Frontend:** Ionic Angular
- **Backend:** Strapi
- **Base de Datos:** PostgreSQL (conectado a Strapi)
- **Despliegue:** Netlify (Frontend) y Render (Backend)

## Funcionalidades Principales

### Inventario de Coches
- Lista de coches disponibles con detalles como marca, modelo, precio y especificaciones.
- Filtros avanzados por:
  - Precio
  - Caballos de fuerza (Horsepower)
  - Marca
- Función de compra con confirmación de acción.
- Gestión de coches con roles específicos (agregar, editar y eliminar).

### Gestión de Clientes
- Registro y autenticación de clientes.
- Modificación de información de perfil.
- Asignación de coches comprados a clientes específicos.

### Historial de Ventas
- Lista de coches vendidos con detalles como:
  - Imagen del coche
  - Marca y modelo
  - Matrícula
  - Cliente asociado (nombre y DNI)

## Instalación y Configuración

### Requisitos Previos

- Node.js (v16 o superior)
- Ionic CLI
- Cuenta en Netlify y Render
- Clonar el repositorio del proyecto:
  ```bash
  git clone <url-repositorio>
  cd <nombre-del-proyecto>
  ```

### Instalación de Dependencias
```bash
npm install
```

### Configuración del Backend
1. Configura Strapi con las colecciones necesarias:
   - **Cars:** Datos de los coches.
   - **Customers:** Datos de los clientes.
   - **Users:** Usuarios relacionados con los clientes.
2. Conecta Strapi a PostgreSQL y despliega en Render.

### Configuración del Frontend
1. Configura el archivo `environment.ts` con las URLs del backend y API de Strapi.
2. Para desarrollo local:
   ```bash
   ionic serve
   ```
3. Para producción, realiza el build:
   ```bash
   ionic build
   ```
   Luego sube los archivos generados en `www/` a Netlify.

## Uso

### Registro e Inicio de Sesión
- Los clientes deben registrarse con datos como nombre, apellido, correo, y contraseña.
- Autenticación mediante JWT para asegurar las sesiones.

### Compra de Coches
- Los clientes autenticados pueden comprar coches del inventario.
- Cada compra actualiza automáticamente el historial de ventas.

### Administración
- Permite agregar nuevos coches al inventario.
- Edición y eliminación de coches existentes.

## Scripts
- **Iniciar en Desarrollo:** `ionic serve`
- **Compilar para Producción:** `ionic build`
- **Aplicar Parches:** `npm run postinstall` (si usas `patch-package`)

## Despliegue

### Frontend
- Utiliza Netlify para el despliegue continuo desde GitHub.

### Backend
- Desplegado en Render con conexión a la base de datos PostgreSQL.
- Desplegado en Firebase

Enlace a netlify: https://concesionarios-baca.netlify.app/home (En netlify hay cosas que no funcionan correctamente)

Enlace al vídeo: https://drive.google.com/file/d/1dUnNviEwfL5N_sSDAoLPyZ0DyUExJY0h/view?usp=drive_link

