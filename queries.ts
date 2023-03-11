import {Pool} from 'pg';
import { Request, Response } from 'express';
import config from './config';
const pool: Pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'development_db',
    password: 'Oliver8677',
    port: 5432,
});
const pool2 = new Pool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port,
})
pool.connect(()=>console.log('Connected to DB'))
pool2.connect(()=>console.log('Connected to Production DB'))
export const initDB =async (req:Request,res:Response) => {
    return pool2.query(`
        CREATE TYPE Category as ENUM('Breakfast','Lunch','Snacks','Desserts','Dinner','Drinks');
        CREATE TABLE "Dishes"(id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL, 
        name VARCHAR(30) NOT NULL, 
        price INTEGER NOT NULL,
        imageUrl VARCHAR(255) NOT NULL,
        description VARCHAR(300) NOT NULL,
        category Category NOT NULL,
        featured boolean NOT NULL,
        rating INTERGER NOT NULL DEFAULT 5,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW());`,(err,response)=>{
            if (err) {
                throw err;
            }
            return res.status(200).json({message:" Database initiated"});
        })
}
enum Category{
    Breakfast,
    Lunch,
    Snacks,
    Dinner,
    Drinks,
    Desserts
}
let rs: {rating: number,id: string,createdAt:Date, category: Category,description: string, name: string, price: number, featured: boolean, updatedAt: Date,imageUrl: string}[] = [];
const addNewDishes =async ()=>{
    try {
        for (let i = 0; i < rs.length; i++) {
            const n = await pool2.query(`INSERT INTO "Dishes" ("id","name","price","imageUrl","description","category","featured","rating","createdAt","updatedAt") values(
                '${rs[i].id}',
                '${rs[i].name}',
                '${rs[i].price}',
                '${rs[i].imageUrl}',
                '${rs[i].description}',
                '${rs[i].category}',
                '${rs[i].featured}',
                '${rs[i].rating}',
                '${rs[i].createdAt.toISOString()}',
                '${rs[i].updatedAt.toISOString()}'
                );`);
        }
    } catch (error) {
        console.log(error);
    }
    
}
export const getDishes = async(req: Request,res: Response)=>{
    return pool.query('SELECT * FROM "Dishes"',(err, data)=>{
        if(err){
            throw err
        }
        // console.log(res.rows);
        rs = data.rows;
        addNewDishes();
        return res.status(200).json({data: data.rows})
    });
}