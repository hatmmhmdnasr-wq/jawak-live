require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const roomsRoutes = require('./routes/rooms');
const giftsRoutes = require('./routes/gifts');
const paymentsRoutes = require('./routes/payments');
const socketService = require('./services/socket');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomsRoutes);
app.use('/api/gifts', giftsRoutes);
app.use('/api/payments', paymentsRoutes);

// health
app.get('/', (req, res) => res.json({ ok: true, now: new Date() }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

socketService(io, prisma);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
