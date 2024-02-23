import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})


//Pegando todas as bands:
app.get("/bands", async(req: Request, res: Response) =>{
    try{
        const result = await db.raw(`
            SELECT * FROM bands;
        `)
        res.status(200).send(result);
    }catch(error){
        if(req.statusCode === 200){
            res.status(500)
        } else {
            res.send("Erro inesperado")
        }
    }
})


// Criando nova bands
app.post("/bands", async (req: Request, res: Response) =>{
    try{
            const id = req.body.id
            const name = req.body.name

            if(!id || !name ){
                res.statusCode = 400;
                throw new Error("Dados inválidos. Deve passar um 'id' e um 'name'.");
            }

            if(typeof id !== "string"){
                res.status(400)
                throw new Error("'id' não é uma string.");
            }

            
            if(typeof name !== "string"){
                res.status(400)
                throw new Error("'name' não é uma string.");
            }
            

            await db.raw(`
                INSERT INTO bands(id, name)
                VALUES ('${id}', '${name}');
            `);
            res.status(201).send("Banda cadastrada com sucesso.")

    }catch(error){
        if(req.statusCode === 200){
            res.status(500)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/bands/:id", async (req: Request, res: Response) =>{
    try{
            const id = req.params.id
            const newName = req.body.name

            if(!newName === undefined){
                res.status(400)
                throw new Error("'name' deve ser passado no body.")
            }

            if(newName !== undefined){
                if(typeof newName !== "string"){
                    res.status(400)
                    throw new Error("'id' não é uma string.");
                }
            }

            
            if(typeof newName !== "string"){
                res.status(400)
                throw new Error("'name' não é uma string.");
            }



            const [band] = await db.raw(
                `SELECT * FROM bands
                WHERE id = "${id}"`
            );

            
            if(band){
                await db.raw(
                    `UPDATE bands
                    SET name = "${newName}"
                    WHERE id = "${id}";`
                );
            } else {
                res.status(400)
                throw new Error("'id' não encontrado")
            }


            res.status(200).send("Atualização realizada com sucesso!")

    }catch(error){
        if(req.statusCode === 200){
            res.status(500)
        } else {
            res.send("Erro inesperado")
        }
    }
})



///////////////////////////////////Songs//////////////////////////////////////////



app.get("/songs", async(req: Request, res: Response) =>{
    try{
        const result = await db.raw(`
            SELECT * FROM songs;
        `)
        res.status(200).send(result);
    }catch(error){
        if(req.statusCode === 200){
            res.status(500)
        } else {
            res.send("Erro inesperado")
        }
    }
})



app.post("/songs", async (req: Request, res: Response) =>{
    try{
           const {id, name, band_id} = req.body;


            if(!id || !name || !band_id){
                res.statusCode = 400;
                throw new Error("Dados inválidos. Deve passar um 'id', um 'name' e um 'band_id'.");
            }

            if(typeof id !== "string"){
                res.statusCode = 400;
                throw new Error("'id' não é uma string.");
            }

            
            if(typeof name !== "string"){
                res.statusCode = 400;
                throw new Error("'name' não é uma string.");
            }
        
            if(typeof band_id !== "string"){
                res.statusCode = 400;
                throw new Error("'band_id' não é uma string.");
            }


            const [band] = await db.raw(`SELECT * FROM bands WHERE id = "${band_id}"`);

            if(band){
                await db.raw(`
                    INSERT INTO songs(id, name, band_id)
                    VALUES ('${id}', '${name}', '${band_id}');
                    `);
                    res.status(201).send("Música cadastrada com sucesso.");
            } else {
                res.statusCode = 404;
                throw new Error("'band_id' - Inexistente.");
            }

    }catch(error){
        if(req.statusCode === 200){
            res.status(500);
        } else {
            res.send("Erro inesperado");
        }
    }
})
