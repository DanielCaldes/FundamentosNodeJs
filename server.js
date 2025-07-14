import http from "node:http";
import {
  ROOMS_FILE,
  RESERVATIONS_FILE,
  INITIAL_ROOMS_DATA,
  INITIAL_RESERVATIONS_DATA
} from "./src/config.js";
import { router } from "./src/router.js";
import { ensureFile } from "./src/utils.js";

export async function createServer() {
  try {
    await ensureFile(ROOMS_FILE, INITIAL_ROOMS_DATA);
    await ensureFile(RESERVATIONS_FILE, INITIAL_RESERVATIONS_DATA);

    const server = http.createServer(async (req, res) => {
      try {
        await router(req, res);
      } catch (err) {
        console.error("Error en la petición:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Error interno" }));
      }
    });

    return server;
  } catch (error) {
    console.error("Error creando el servidor:", error);
    throw error;
  }
}
