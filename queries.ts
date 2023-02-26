import {Pool} from 'pg';
import { Request, Response } from 'express';
import { timeStamp } from 'console';
const pool: Pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'development_db',
    password: 'Oliver8677',
    port: 5432,
});
// postgres://production_i7rh_user:27OaPfa83jPu8m3OaADlc7cPUB2ykUXs@dpg-cftosnp4reb6ks16lp30-a.oregon-postgres.render.com/production_i7rh
const pool2 = new Pool({
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port ,
    ssl: true
})
pool.connect(()=>console.log('Connected to DB'))
pool2.connect(()=>console.log('Connected to Production DB'))
export const initDB =async (req:Request,res:Response) => {
    return pool2.query(`
        CREATE TYPE Category as ENUM('Breakfast','Lunch','Snacks','Desserts','Dinner','Drinks');
        CREATE TABLE IF NOT EXISTS "Dishes"(id uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL, 
        name VARCHAR(30) NOT NULL, 
        price INTEGER NOT NULL,
        rating INTERGER NOT NULL DEFAULT 5,
        imageUrl VARCHAR(200) NOT NULL,
        description VARCHAR(300) NOT NULL,
        category Category NOT NULL,
        featured boolean NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
        updatedAt TIMESTAMP NOT NULL DEFAULT NOW());`,(err,response)=>{
            if (err) {
                throw err;
            }
            return res.status(200).json({message:" Database initiated"})
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
    for (let i = 0; i < rs.length; i++) {
        console.log(rs[i]);
        const n = await pool2.query(`INSERT INTO "Dishes" values(
            ${rs[i].id}
            ${rs[i].name},
            ${rs[i].price},
            ${rs[i].imageUrl},
            ${rs[i].description},
            ${rs[i].category},
            ${rs[i].featured},
            ${rs[i].updatedAt},
            ${rs[i].createdAt}
            );`);
        console.log(n);
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