const BASE_PATH = "/reservations";

import { notImplemented } from "../utils.js";
import { postReservation, deleteReservation } from "../controllers/reservations.controller.js"

export const reservationsRoutes = [
    {
        method: "GET",
        path: `${BASE_PATH}`,
        controller: notImplemented,
        description: "Listar reservas"
    },
    {
        method: "POST",
        path: `${BASE_PATH}`,
        controller: postReservation,
        description: "Añadir reserva",
        body: {
            roomId: "Id de la sala (obligatorio)",
            username: "Nombre del usuario que hará la reserva",
            peopleCount: "Número de personas para las que se realiza la reserva",
            startDate: "Fecha y hora de inicio en formato ISO (obligatorio)",
            endDate: "Fecha y hora de fin en formato ISO (obligatorio)"
        }
    },
    {
        method: "DELETE",
        path: `${BASE_PATH}/:id`,
        controller: deleteReservation,
        description: "Borrar reserva por ID"
    }
];