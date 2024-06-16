const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});
aaa;

app.get("/error", (req, res) => {
  res.send("¡Error resuelto!");
});
app;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
