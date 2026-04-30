import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// Datos iniciales — Pokédex
let pokemon = [
  {
    id: crypto.randomUUID(),
    nombre: "Pikachu",
    tipo: "eléctrico",
    nivel: 25,
    hp: 55,
    ataques: ["Impactrueno", "Rayo", "Ataque rápido", "Cola férrea"],
  },
  {
    id: crypto.randomUUID(),
    nombre: "Charmander",
    tipo: "fuego",
    nivel: 12,
    hp: 39,
    ataques: ["Llamarada", "Ascuas", "Arañazo", "Rugido"],
  },
  {
    id: crypto.randomUUID(),
    nombre: "Bulbasaur",
    tipo: "planta",
    nivel: 10,
    hp: 45,
    ataques: ["Látigo cepa", "Absorber", "Polvo veneno", "Placaje"],
  },
  {
    id: crypto.randomUUID(),
    nombre: "Squirtle",
    tipo: "agua",
    nivel: 15,
    hp: 44,
    ataques: ["Pistola agua", "Placaje", "Protección", "Surf"],
  },
  {
    id: crypto.randomUUID(),
    nombre: "Gengar",
    tipo: "fantasma",
    nivel: 40,
    hp: 60,
    ataques: ["Bola sombra", "Hipnosis", "Tinieblas", "Rayo hielo"],
  },
];

// ─── Rutas informativas ───────────────────────────────────────────────────────

app.get("/", (req, res) => {
  res.send(`
    <html>
    <head><style>body{font-family:monospace;padding:2rem;background:#1a1a2e;color:#e0e0e0}
    h1{color:#f7c948}h2{color:#a8d8ea}table{border-collapse:collapse;width:100%}
    th,td{border:1px solid #444;padding:.5rem 1rem;text-align:left}th{background:#2d2d44}
    code{background:#2d2d44;padding:.1rem .4rem;border-radius:4px}
    .get{color:#6bff6b}.post{color:#f7c948}.put{color:#80c8ff}.patch{color:#d4a8ff}.delete{color:#ff7070}
    </style></head>
    <body>
    <h1>Pokédex API</h1>
    <h2>Endpoints informativos</h2>
    <table>
      <tr><th>Método</th><th>Ruta</th><th>Descripción</th></tr>
      <tr><td class="get">GET</td><td><code>/</code></td><td>Esta documentación</td></tr>
      <tr><td class="get">GET</td><td><code>/info</code></td><td>Información del curso</td></tr>
      <tr><td class="get">GET</td><td><code>/saludo</code></td><td>Saludo personalizado</td></tr>
      <tr><td class="get">GET</td><td><code>/api/status</code></td><td>Estado del servidor</td></tr>
    </table>
    <h2>CRUD — /api/pokemon</h2>
    <table>
      <tr><th>Método</th><th>Ruta</th><th>Descripción</th></tr>
      <tr><td class="get">GET</td><td><code>/api/pokemon</code></td><td>Todos los pokémon (filtros: ?tipo=fuego, ?nivel=20)</td></tr>
      <tr><td class="get">GET</td><td><code>/api/pokemon/:id</code></td><td>Pokémon por ID</td></tr>
      <tr><td class="post">POST</td><td><code>/api/pokemon</code></td><td>Crear pokémon</td></tr>
      <tr><td class="put">PUT</td><td><code>/api/pokemon/:id</code></td><td>Reemplazar pokémon completo</td></tr>
      <tr><td class="patch">PATCH</td><td><code>/api/pokemon/:id</code></td><td>Actualizar campos parciales</td></tr>
      <tr><td class="delete">DELETE</td><td><code>/api/pokemon/:id</code></td><td>Eliminar pokémon</td></tr>
    </table>
    </body></html>
  `);
});

app.get("/info", (req, res) => {
  res.json({
    ok: true,
    data: {
      mensaje: "API REST de Pokédex",
      curso: "Sistemas y Tecnologías Web",
      tecnologia: "Node.js + Express",
      version: "1.0.0",
    },
  });
});

app.get("/saludo", (req, res) => {
  res.type("text/plain").send("¡Bienvenido a la Pokédex API! Gotta catch 'em all.");
});

app.get("/api/status", (req, res) => {
  res.json({
    ok: true,
    status: "online",
    puerto: PORT,
    timestamp: new Date().toISOString(),
  });
});

// ─── CRUD /api/pokemon ────────────────────────────────────────────────────────

app.get("/api/pokemon", (req, res) => {
  const { tipo, nivel } = req.query;
  let resultado = pokemon;

  if (tipo) {
    resultado = resultado.filter(
      (p) => p.tipo.toLowerCase() === tipo.toLowerCase()
    );
  }

  if (nivel) {
    const nivelMin = parseInt(nivel);
    if (!isNaN(nivelMin)) {
      resultado = resultado.filter((p) => p.nivel >= nivelMin);
    }
  }

  res.json({ ok: true, data: resultado });
});

app.get("/api/pokemon/:id", (req, res) => {
  const found = pokemon.find((p) => p.id === req.params.id);
  if (!found) return res.status(404).json({ ok: false, error: "Pokémon no encontrado" });
  res.json({ ok: true, data: found });
});

app.post("/api/pokemon", (req, res, next) => {
  try {
    const faltantes = ["nombre", "tipo", "nivel", "hp", "ataques"].filter(
      (campo) => req.body[campo] === undefined
    );
    if (faltantes.length > 0) {
      return res.status(400).json({
        ok: false,
        error: `Faltan campos obligatorios: ${faltantes.join(", ")}`,
      });
    }
    const { nombre, tipo, nivel, hp, ataques } = req.body;
    const nuevo = { id: crypto.randomUUID(), nombre, tipo, nivel, hp, ataques };
    pokemon.push(nuevo);
    res.status(201).json({ ok: true, data: nuevo });
  } catch (err) {
    next(err);
  }
});

app.put("/api/pokemon/:id", (req, res, next) => {
  try {
    const idx = pokemon.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ ok: false, error: "Pokémon no encontrado" });

    const faltantes = ["nombre", "tipo", "nivel", "hp", "ataques"].filter(
      (campo) => req.body[campo] === undefined
    );
    if (faltantes.length > 0) {
      return res.status(400).json({
        ok: false,
        error: `PUT requiere todos los campos. Faltan: ${faltantes.join(", ")}`,
      });
    }
    const { nombre, tipo, nivel, hp, ataques } = req.body;
    pokemon[idx] = { id: req.params.id, nombre, tipo, nivel, hp, ataques };
    res.json({ ok: true, data: pokemon[idx] });
  } catch (err) {
    next(err);
  }
});

app.patch("/api/pokemon/:id", (req, res, next) => {
  try {
    const idx = pokemon.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ ok: false, error: "Pokémon no encontrado" });

    pokemon[idx] = { ...pokemon[idx], ...req.body, id: req.params.id };
    res.json({ ok: true, data: pokemon[idx] });
  } catch (err) {
    next(err);
  }
});

app.delete("/api/pokemon/:id", (req, res, next) => {
  try {
    const idx = pokemon.findIndex((p) => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ ok: false, error: "Pokémon no encontrado" });

    const eliminado = pokemon.splice(idx, 1)[0];
    res.json({ ok: true, data: eliminado });
  } catch (err) {
    next(err);
  }
});

// ─── Ruta 404 ─────────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method,
    sugerencia: "Visita / para ver los endpoints disponibles",
  });
});

// ─── Manejador de errores 500 ─────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    ok: false,
    error: "Error interno del servidor",
  });
});

app.listen(PORT, () => {
  console.log(`Pokédex API corriendo en http://localhost:${PORT}`);
});
