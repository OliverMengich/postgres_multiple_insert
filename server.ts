import express from 'express';
import { getDishes, initDB } from './queries';
const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.get('/api',(req,res)=>{
    res.status(200).json({message: 'HELLO'})
});
app.get('/api/init',initDB)
app.get('/api/dishes',getDishes)
app.listen(4000,()=>{
    console.log("Server running on Port 3000");
})