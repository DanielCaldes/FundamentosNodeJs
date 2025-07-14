import {promises as fs} from "node:fs"
import { DATA_DIR } from "./config.js";

export async function ensureFile(file, defaultValue){
    try{
        await fs.access(file);
    }catch(err){
        await fs.mkdir(DATA_DIR, {recursive:true})
        await fs.writeFile(file, JSON.stringify(defaultValue, null, 2))
    }
}

export const readJson = async (f) => JSON.parse(await fs.readFile(f, "utf-8"));
export const writeJson = async (f,d) => fs.writeFile(f, JSON.stringify(d,null,2));

export function send(res, status, payload){
    const body = JSON.stringify(payload);
    res.writeHead(
        status,
        {"Content-Type":"application/json", "Content-Length":Buffer.byteLength(body)}
    );
    res.end(body);
}

export function parseBody(req) {
    return new Promise( (resolve, reject) => {
        let buf = "";
        req.on("data", chunk => (buf+= chunk)),
        req.on("end", ()=>{
            try{ resolve(JSON.parse(buf || "{}")); }
            catch(err){ reject(new Error("JSON no valido")); }
        })
    })
}

export const notImplemented = (req, res, status) => {
  res.writeHead(501, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "No implementado aún" }));
};