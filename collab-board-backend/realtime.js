let io;

const configureRealtime = (socketServer) => {
  io = socketServer;
};

const emitToBoard = (boardId, event, payload) => {
  if (io && boardId) io.to(`board:${boardId}`).emit(event, payload);
};

module.exports = { configureRealtime, emitToBoard };
