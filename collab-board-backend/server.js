// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const boardRoutes = require('./routes/boardRoutes');
const teamRoutes = require('./routes/teamRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const { configureRealtime } = require('./realtime');
const Board = require('./models/Board');

const app = express();
const server = http.createServer(app);
const connectedUsers = new Map();
const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const isAllowedOrigin = (origin, callback) => {
  // During local development, allow devices on the same network as well as localhost.
  if (!origin || process.env.NODE_ENV !== 'production' || configuredOrigins.includes(origin)) {
    return callback(null, true);
  }
  return callback(new Error('Origin is not allowed by CORS'));
};
const corsOptions = { origin: isAllowedOrigin, credentials: true };
const io = new Server(server, {
  cors: corsOptions,
});

configureRealtime(io);

const onlineUserIds = () => [...connectedUsers.keys()];
const broadcastPresence = () => io.emit('presence:sync', onlineUserIds());

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.userId = decoded.id || decoded._id;
    next();
  } catch {
    next(new Error('Authentication required'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.data.userId?.toString();
  if (userId) {
    connectedUsers.set(userId, (connectedUsers.get(userId) || 0) + 1);
    broadcastPresence();
  }

  socket.on('presence:request', () => {
    socket.emit('presence:sync', onlineUserIds());
  });

  socket.on('board:join', async (boardId) => {
    const board = await Board.findById(boardId).select('members');
    const isMember = board?.members.some((member) => member.toString() === socket.data.userId?.toString());
    if (isMember) socket.join(`board:${boardId}`);
  });

  socket.on('board:leave', (boardId) => {
    if (typeof boardId === 'string') socket.leave(`board:${boardId}`);
  });

  socket.on('disconnect', () => {
    if (!userId) return;
    const remainingConnections = (connectedUsers.get(userId) || 1) - 1;
    if (remainingConnections > 0) connectedUsers.set(userId, remainingConnections);
    else connectedUsers.delete(userId);
    broadcastPresence();
  });
});

// ==================== MIDDLEWARE ====================

// CORS
app.use(cors(corsOptions));

// Parse JSON requests
// Profile avatars are stored as data URLs, which can exceed Express's 100 KB default.
app.use(express.json({ limit: '5mb' }));

// ==================== ROUTES ====================

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/notifications', notificationRoutes);

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CollabBoard API is running!',
  });
});

// ==================== 404 HANDLER ====================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ==================== GLOBAL ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
