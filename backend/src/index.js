const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});
app.get("/error", (req, res) => {
  res;
  aaa;
  res.send("¡Error resuelto!");
});
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
