import app from "./app.js";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Servidor corriendo en http://localhost:${PORT} en ${process.env.NODE_ENV} mode`);
});
