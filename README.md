# Laboratorio 4 — JavaScript API con Node.js y Express

Proyecto del curso **Sistemas y Tecnologías Web** que cubre dos partes: depuración de un servidor HTTP nativo con errores intencionales, y construcción de una REST API completa de gestión de Pokémon con Express.

---

## Estructura del proyecto

```
lab-4WEB/
├── api/
│   └── index.js              # API principal (Pokédex)
├── basic_template/
│   └── basic_template/
│       └── index.js          # Template de ejemplo (blog API)
├── servidor-malo.js          # Servidor HTTP con 6 bugs intencionales
├── servidor-corregido.js     # Servidor HTTP corregido
├── datos.json                # Datos de ejemplo (información del estudiante)
├── SOLUCION.md               # Documentación de los 6 bugs encontrados y corregidos
└── PRUEBAS.md                # Evidencia de pruebas con capturas de Thunder Client
```

---

## Parte 1 — Depuración de servidor HTTP

`servidor-malo.js` contiene un servidor HTTP escrito con el módulo nativo `node:http` que tiene **6 errores intencionales** de distintas categorías. El objetivo fue identificarlos, corregirlos y documentarlos.

Los errores encontrados y su solución están documentados en [SOLUCION.md](SOLUCION.md). `servidor-corregido.js` contiene el servidor con todos los errores resueltos.

### Tipos de errores trabajados

| # | Tipo de error | Descripción |
|---|---------------|-------------|
| 1 | MIME type incorrecto | `Content-Type` con valor erróneo para JSON |
| 2 | `await` faltante | Lectura asíncrona de archivo sin `await` |
| 3 | Doble codificación JSON | `JSON.stringify` aplicado dos veces |
| 4 | Status code incorrecto | Respuestas exitosas con código de error |
| 5 | Error de sintaxis | Código que impide arrancar el servidor |
| 6 | Lógica de enrutamiento | Rutas que nunca se alcanzan |

---

## Parte 2 — REST API Pokédex

API RESTful construida con **Express.js** que implementa un CRUD completo sobre una colección de Pokémon en memoria, con filtrado por query params, validación de datos, manejo de errores y respuestas HTTP con los códigos correctos.

### Stack tecnológico

| Componente | Tecnología |
|------------|------------|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js ^5.2.1 |
| IDs | `crypto.randomUUID()` |
| Almacenamiento | En memoria (array en proceso) |
| Testing | Thunder Client |

---

## Endpoints

### Rutas informativas

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Página HTML con documentación de la API |
| `GET` | `/info` | Metadata: curso, versión, tecnologías |
| `GET` | `/saludo` | Mensaje de bienvenida |
| `GET` | `/api/status` | Estado del servidor y timestamp actual |

### CRUD — `/api/pokemon`

| Método | Ruta | Descripción | Status exitoso |
|--------|------|-------------|----------------|
| `GET` | `/api/pokemon` | Listar todos los Pokémon | `200` |
| `GET` | `/api/pokemon?tipo=fuego` | Filtrar por tipo | `200` |
| `GET` | `/api/pokemon?nivel=20` | Filtrar por nivel mínimo | `200` |
| `GET` | `/api/pokemon/:id` | Obtener un Pokémon por ID | `200` |
| `POST` | `/api/pokemon` | Crear nuevo Pokémon | `201` |
| `PUT` | `/api/pokemon/:id` | Reemplazar Pokémon completo | `200` |
| `PATCH` | `/api/pokemon/:id` | Actualizar campos parcialmente | `200` |
| `DELETE` | `/api/pokemon/:id` | Eliminar Pokémon | `200` |

### Manejo de errores

| Situación | Status |
|-----------|--------|
| Pokémon no encontrado | `404` |
| Campos requeridos faltantes en `POST`/`PUT` | `400` |
| Ruta no existente | `404` |
| Error interno del servidor | `500` |

---

## Modelo de dato — Pokémon

```json
{
  "id": "uuid-generado-automaticamente",
  "nombre": "Charizard",
  "tipo": "fuego",
  "nivel": 36,
  "hp": 78,
  "ataques": ["lanzallamas", "vuelo", "garra dragón"]
}
```

**Campos requeridos para `POST`:** `nombre`, `tipo`, `nivel`, `hp`, `ataques`

---

## Instalación y uso

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior (se usan ES Modules nativos y `crypto.randomUUID()`)
- npm (viene incluido con Node.js)

Verificá tu versión con:

```bash
node -v   # debe ser >= 18
npm -v
```

---

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd lab-4WEB
```

---

### 2. Instalar dependencias

```bash
npm install
```

Esto instala **Express.js** (única dependencia externa del proyecto).

---

### 3. Correr el proyecto

#### Parte 2 — API Pokédex (Express)

```bash
npm start
# equivalente a: node api/index.js
```

La API queda disponible en `http://localhost:3000`.

Podés verificar que está corriendo abriendo `http://localhost:3000` en el navegador o ejecutando:

```bash
curl http://localhost:3000/api/status
```

#### Parte 1 — Servidor HTTP corregido

```bash
npm run servidor
# equivalente a: node servidor-corregido.js
```

Este servidor también corre en `http://localhost:3000`. **No lo inicies al mismo tiempo que la API**, ya que ambos usan el mismo puerto.

---

### 4. Probar los endpoints

Con la API corriendo, podés probar los endpoints desde la terminal:

```bash
# Listar todos los Pokémon
curl http://localhost:3000/api/pokemon

# Filtrar por tipo
curl "http://localhost:3000/api/pokemon?tipo=fuego"

# Filtrar por nivel mínimo
curl "http://localhost:3000/api/pokemon?nivel=20"

# Crear un Pokémon nuevo
curl -X POST http://localhost:3000/api/pokemon \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Gengar","tipo":"fantasma","nivel":30,"hp":60,"ataques":["Bola sombra","Hipnosis"]}'

# Obtener un Pokémon por ID (reemplazá <id> por un UUID real)
curl http://localhost:3000/api/pokemon/<id>

# Actualizar parcialmente
curl -X PATCH http://localhost:3000/api/pokemon/<id> \
  -H "Content-Type: application/json" \
  -d '{"nivel":35}'

# Eliminar
curl -X DELETE http://localhost:3000/api/pokemon/<id>
```

También podés usar **Thunder Client** (VS Code), **Postman** o cualquier cliente HTTP. Las pruebas completas están documentadas en [PRUEBAS.md](PRUEBAS.md).

---

## Pruebas

Las pruebas de todos los endpoints fueron realizadas con **Thunder Client** y están documentadas con capturas de pantalla en [PRUEBAS.md](PRUEBAS.md).
