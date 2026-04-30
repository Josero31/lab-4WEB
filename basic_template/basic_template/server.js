const express = require("express");
const { uid } = require("uid");

// El objeto que tendra el api
const app = express();
app.use(express.json());
// puerto donde estara el api
const port = 3001;

let usuarios = [
  {
    id: uid(),
    name: "Luis",
    description: "Jugador",
    level: 90,
  },
  {
    id: uid(),
    name: "ANA",
    description: "Maestra",
    level: 100,
  },
];

// EJEMPLOS DE GET -> PARA OBTENER DATA
app.get("/", (req, res) => {
  res.send(`<html>
    <h1>ENDPOINTS DISPONIBLES:</h1>
    <h3>GET:</h3>
    <ul>
    <li>/usuarios</li>
    <li>/usuario/{id_usuario}</li>
    </ul>
    <p> Para traer un usuario hay que agregar un uid en la busqueda</p>
    </html>`);
});
app.get("/usuario", (req, res) => {
  res.json(usuarios[0]);
});
app.get("/usuarios", (req, res) => {
  res.send(usuarios);
});

// EJEMPLO POST -> PARA CREAR DATOS
app.post("/usuario", (req, res) => {
  let usuario_nuevo = req.body;
  console.log(req.body);
  usuarios.push({
    ...usuario_nuevo,
    id: uid(),
  });
  res.send(usuarios);
});

// EJEMPLO DELETE => PARA ELIMINAR
app.delete("/usuario/:id", (req, res) => {
  let id_eliminar = req.params.id;
  usuarios = usuarios.filter((_us) => _us.id != id_eliminar);
  res.send(usuarios);
});

// EJEMPLO PUT => PARA ACTUALIZAR
app.put("/usuario/:id", (req, res) => {
  // data request
  let usuario_nuevo = req.body;
  //   id a buscar para actualizar
  let id_buscar = req.params.id;

  //   busco el usuario por id
  let usuario_encontrado = usuarios.find((u) => u.id == id_buscar);
  if (usuario_encontrado) {
    // actualizo usando la data del request
    usuario_encontrado.name = usuario_nuevo.name;
    usuario_encontrado.level = usuario_nuevo.level;
    usuario_encontrado.description = usuario_nuevo.description;
    // BUSCO EL INDICE EN EL ARREGLO
    let currentIndex = usuarios.findIndex((u) => u.id == id_buscar);
    // SOBRE ESCRIBO EL VALOR EN EL ARREGLO
    usuarios[currentIndex] = usuario_encontrado;
    res.send(usuarios);
  } else {
    res.status(404).send("No existe");
  }
});

app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}`);
});
