import { readJson, send } from "../utils.js"
import { ROOMS_FILE } from "../config.js";

export async function getRoomsFromJson(){
    return await readJson(ROOMS_FILE);
}


export async function getRooms(req, res, params){
    try{
        const rooms = await getRoomsFromJson();
        return send(res, 200, rooms);
    }
    catch(error){
        return send(res, 500, { error: "Error interno al leer las salas" });  
    }
}

export async function getRoomById(req, res, params){
    const {id} = params;
    if (id === null || id === undefined) { return send(res, 400, { error: "Mande el parámetro id en la url" }); }

    try{
        const rooms = await getRoomsFromJson();
        const room = rooms.find((room) => room.id == id) || null;

        if(!room){ 
            return send(res, 404, {message:"La habitación solicitada no existe"});
        }
        else{
            return send(res, 200, room);
        }
    }
    catch(error){
        return send(res, 500, { error: "Error interno al leer las salas" });  
    }
}
