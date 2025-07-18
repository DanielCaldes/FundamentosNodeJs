
# Fundamentos NodeJs

Este proyecto es parte del módulo de **Fundamentos de Backend con Node.js** del Máster en Desarrollo Web. Se ha desarrollado una aplicación sencilla de gestión de **salas y reservas** utilizando **Node.js** sin frameworks, con almacenamiento en archivos **JSON**, un sistema de rutas personalizado y manejo básico de concurrencia.

GitHub del proyecto:  
```url
https://github.com/DanielCaldes/FundamentosNodeJs
```

## Características

- **Servidor HTTP** implementado manualmente con el módulo `http` de Node.js.
- **Persistencia en JSON**: Lectura y escritura de datos en ficheros `rooms.json` y `reservations.json`.
- **Sistema de rutas modular**:
  - Definición de rutas por secciones (`/rooms`, `/reservations`...).
  - Uso de expresiones regulares para rutas dinámicas (`/room/:id`).
- **Controladores separados** para cada ruta.
- **Documentación embebida estilo Swagger UI**: El sistema permite definir descripciones y ejemplos por ruta.
- **Mutex de concurrencia**: Evita condiciones de carrera al modificar ficheros JSON.
- **Ayuda integrada**: Rutas separadas para documentación de la API (`/help`).

## Requisitos

- Node.js  
- Entorno local con permisos de lectura/escritura  
(No requiere base de datos ni contenedores)

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/DanielCaldes/FundamentosNodeJs.git
   cd FundamentosNodeJs
   ```

2. Ejecuta el servidor:

   ```bash
   node .
   ```

3. El servidor estará disponible en:

   ```
   http://localhost:3000
   ```

## Estructura del proyecto

```
FundamentosNodeJs/
├── data/
│   ├── rooms.json
│   └── reservations.json
├── routes/
│   ├── room.routes.js
│   ├── reservation.routes.js
│   └── help.routes.js
├── controllers/
│   ├── room.controller.js
│   └── reservation.controller.js
├── scripts/
│   └── concurrency-reservation.js
├── utils.js
├── config.js
├── index.js
├── router.js
└── server.js
```

## Endpoints principales
**Nota**: Todos los endpoint están recodigos bajo ``/api``

### Salas

#### 1. Listar salas

- **Método**: GET  
  ```url
  api/rooms
  ```
- **Descripción**: Devuelve una lista de todas las salas disponibles.
- **Respuesta**:
  ```json
  [
    {
      "id": 0,
      "name": "A-1",
      "capacity": 10
    },
    {
      "id": 1,
      "name": "A-2",
      "capacity": 10
    }
  ]
  ```

#### 2. Obtener sala por ID

- **Método**: GET  
  ```url
  api/rooms/:id
  ```
- **Descripción**: Devuelve la información de una sala específica por su ID.
- **Respuesta**:
  ```json
  {
    "id": 0,
    "name": "A-1",
    "capacity": 10
  }
  ```

---

### Reservas

#### 1. Listar reservas

- **Método**: GET  
  ```url
  /api/reservations
  ```
- **Descripción**: Devuelve una lista de reservas existentes.  
  ⚠️ Actualmente devuelve `"Not implemented"` ya que la funcionalidad no está desarrollada aún.

- **Respuesta**:
  ```json
  {
    "message": "Not implemented"
  }
  ```

#### 2. Crear una reserva

- **Método**: POST  
  ```url
  /api/reservations
  ```
- **Descripción**: Crea una nueva reserva para una sala durante un intervalo de tiempo.
- **Cuerpo de la solicitud** (JSON):
  ```json
  {
    "roomId": 0,
    "username": "Daniel",
    "peopleCount": 5,
    "startDate": "2025-07-20T10:00:00.000Z",
    "endDate": "2025-07-20T12:00:00.000Z"
  }
  ```
- **Respuesta**:
  ```json
  {
    "id": 2,
    "roomId": 0,
    "username": "Daniel",
    "startDate": "2025-07-21T10:00:00.000Z",
    "endDate": "2025-07-21T12:00:00.000Z"
  }
  ```

#### 3. Borrar una reserva

- **Método**: DELETE  
  ```url
  /api/reservations/:id
  ```
- **Descripción**: Elimina una reserva existente según su ID.
- **Respuesta**:
  ```json
  {
    "message": "Reserva 2 de 2025-07-21T10:00:00.000Z a 2025-07-21T12:00:00.000Z anulada con éxito"
  }
  ```

### Ayuda (`/help`)

#### 1. Listar secciones de ayuda

- **Método**: GET  
  ```url
  /api/help
  ```
- **Descripción**: Devuelve una lista de secciones disponibles para las que se puede consultar ayuda.
- **Respuesta**:
  ```json
  [
    {
      "section": "rooms",
      "description": "Rutas relacionadas con rooms"
    },
    {
      "section": "reservations",
      "description": "Rutas relacionadas con reservations"
    }
  ]
  ```

#### 2. Obtener ayuda de una sección específica

- **Método**: GET  
  ```url
  /api/help/:section
  ```
- **Descripción**: Devuelve información detallada sobre los endpoints disponibles dentro de una sección específica (`rooms` o `reservations`).
- **Respuesta**:
  ```json
  [
    {
      "method": "GET",
      "path": "/room",
      "route": "Listar salas"
    },
    {
      "method": "GET",
      "path": "/room/:id",
      "route": "Obtener sala por id"
    }
  ]
  ```

- **Error**:
  ```json
  {
    "error": "Sección no encontrada"
  }
  ```


## Concurrencia y mutex

El acceso a los ficheros JSON está protegido por un sistema de **mutex** que garantiza exclusión mutua. Esto previene condiciones de carrera cuando múltiples peticiones intentan escribir en simultáneo.

Un script de prueba ubicado en `scripts/race-condition-test.js` permite lanzar dos peticiones paralelas para verificar el correcto funcionamiento de la exclusión mutua.


## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más información.
