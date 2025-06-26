import { Router } from 'express';

const router = Router();


router.get('/detail',(req,res)=>{
    res.send("In auction endpoint")
})


export default router;