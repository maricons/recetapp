const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const categorias = [
    "Almuerzo",
    "Cena",
    "Postres",
    "Acompañamientos",
    "Kuchen y Queques",
    "Tortas y Pasteles",
    "Entradas",
    "Repostería",
    "Ensaladas",
    "Celebraciones"
  ];

// Endpoint para obtener las categorías
app.get('/api/categorias', (req, res) => {
  res.json(categorias); //URL acceder a la lista de categorías http://localhost:3000/api/categorias
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
