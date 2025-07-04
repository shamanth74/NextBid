import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';

// import userRoutes from './routes/user';
import auctionRoutes from './routes/auctions';
import bidRoutes from './routes/bids';
import webhooks from './routes/webhooks';
import http from "http";
import users from './routes/users';
import { setupWebSocketServer } from "./ws/index";
dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// app.use('/api/users',userRoutes);
app.use('/api/auctions',auctionRoutes);
app.use('/api/bids',bidRoutes);
app.use('/api/webhooks',webhooks);
app.use('/api/users',users);

setupWebSocketServer(server);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});