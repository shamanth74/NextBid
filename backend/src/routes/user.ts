import { Router } from 'express';

const router = Router();

router.get('/detail',(req,res)=>{
    res.send("In user endpoint")
})

export default router;