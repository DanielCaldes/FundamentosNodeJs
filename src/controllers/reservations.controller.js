import { RESERVATIONS_FILE } from "../config.js";
import { readJson, writeJson, send, parseBody } from "../utils.js";
import { getRoomsFromJson } from "./rooms.controller.js"
import { Mutex } from 'async-mutex';


const mutex = new Mutex();

export async function getReservationsFromJson(){
    return await readJson(RESERVATIONS_FILE);
}

export async function setReservationsToJson(data){
    return await writeJson(RESERVATIONS_FILE, data);
}

function isValidDate(value) {
    const date = new Date(value);
    return !isNaN(date.getTime());
}

function isOverlapping(newRes, oldRes){
    return  new Date(newRes.startDate) < new Date(oldRes.endDate) &&
            new Date(newRes.endDate) > new Date(oldRes.startDate);
}

function getNextReservationId(reservations) {
    if (reservations.length === 0) return 1;
    const maxId = reservations.reduce((max, r) => (r.id > max ? r.id : max), 0);
    return maxId + 1;
}

export async function postReservation(req, res, params){
    const {roomId, username, peopleCount, startDate, endDate} = await parseBody(req) || {};

    if(!roomId) {
        return send(res, 400, { error: "El parámetro 'roomId' es obligatorio" });
    }
    if(!username) {
        return send(res, 400, { error: "El parámetro 'username' es obligatorio" });
    }
    if(!peopleCount) {
        return send(res, 400, { error: "El parámetro 'peopleCount' es obligatorio" });
    }
    if(!startDate || !isValidDate(startDate)) {
        return send(res, 400, { error: "El parámetro 'startDate' es obligatorio y debe tener formato de fecha y hora válido. Ejemplo: '2025-07-14T10:00:00Z'" }); 
    }
    if(!endDate || !isValidDate(endDate)){
        return send(res, 400, { error: "El parámetro 'endDate' es obligatorio y debe tener formato de fecha y hora válido. Ejemplo: '2025-07-14T10:00:00Z'" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
        return send(res, 400, { error: "La fecha 'endDate' debe ser posterior a 'startDate'" });
    }

    try{
        const rooms = await getRoomsFromJson();
        const room = rooms.find((room) => room.id == roomId);
        if(!room) {
            return send(res, 404, {message:"La habitación solicitada no existe asegurese de pasar un id válido"});
        }

        if(room.maxCapability < peopleCount) {
            return send(res, 409, {message:"La habitación solicitada no tiene capacidad suficiente para tantas personas"});
        }
        
        const release = await mutex.acquire();
        try{    
            const reservations = await getReservationsFromJson();
            const isBooked = reservations.some((reservation) => reservation.roomId == roomId && isOverlapping({startDate, endDate}, reservation));
            if(isBooked){
                return send(res, 409, {message:"La habitación ya está reservada en la franja horaria solicitada"}); 
            }
            const newReservationId = getNextReservationId(reservations);
            const newReservation = {id:newReservationId, username, roomId, startDate, endDate};
            reservations.push(newReservation);
            try{
                await setReservationsToJson(reservations);
                return send(res, 201, newReservation);
            }catch(error){
                return send(res, 500, { error: "Error interno al guardar las reservas" }); 
            }
        }
        catch(error){
            release();
            return send(res, 500, { error: "Error interno al leer las reservas" }); 
        }
        finally{
            release(); 
        }
    }
    catch(error){
       return send(res, 500, { error: "Error interno al leer las salas" });   
    }

}

export async function deleteReservation(req, res, params){
    const {id} = params;
    if (!id) {
        return send(res, 400, { error: "Mande el parámetro id en la url" });
    }

    try{
        const reservations = await getReservationsFromJson();
        const reservation = reservations.find((reservation) => reservation.id == id);

        if(!reservation){ 
            return send(res, 404, {message:"La reserva solicitada no existe"});
        }

        const newReservations = reservations.filter(r => r.id !== reservation.id);
        await setReservationsToJson(newReservations);
        return send(res, 200, {
            message: `Reserva ${reservation.id} de ${reservation.startDate} a ${reservation.endDate} anulada con éxito`
        });
    }
    catch(error){
        return send(res, 500, { error: "Error interno al leer las salas" });  
    }
}