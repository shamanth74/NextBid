import { Router } from 'express';

const router = Router();



router.get('/bids',(req,res)=>{
    res.send("In bids endpoint")
})

export default router;