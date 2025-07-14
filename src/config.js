import path from "node:path"

export const PORT = 3000;
export const DATA_DIR = path.resolve("./data");

export const ROOMS_FILE = path.join(DATA_DIR,"rooms.json");
export const RESERVATIONS_FILE = path.join(DATA_DIR,"reservations.json");

export const INITIAL_ROOMS_DATA = [
    { id: 0, name : "A-1", maxCapability:10 },
    { id: 1, name : "A-2", maxCapability:10 },
    { id: 2, name : "B-1", maxCapability:5 },
    { id: 3, name : "B-2", maxCapability:5 },
];
export const INITIAL_RESERVATIONS_DATA = [];