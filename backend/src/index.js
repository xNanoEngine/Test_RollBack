const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
asdada;
app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
