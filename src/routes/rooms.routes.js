const BASE_PATH = "/rooms";
import { getRoomById, getRooms } from "../controllers/rooms.controller.js";

export const roomRoutes = [
    {
        method: "GET",
        path: `${BASE_PATH}`,
        controller: getRooms,
        description: "Listar salas"
    },
    {
        method: "GET",
        path: `${BASE_PATH}/:id`,
        controller: getRoomById,
        description: "Obtener sala por id"
    }
];
