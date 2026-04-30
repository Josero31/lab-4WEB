import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// Datos iniciales — Pokédex (dominio elegido: paso 2.2)
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

app.listen(PORT, () => {
  console.log(`Pokédex API corriendo en http://localhost:${PORT}`);
});
