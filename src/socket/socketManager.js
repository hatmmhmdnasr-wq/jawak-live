module.exports = (io, prisma) => {
  io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on('join-room', async ({ roomId, userId }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = userId;
      socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
    });

    socket.on('signal', ({ toSocketId, data }) => {
      io.to(toSocketId).emit('signal', { from: socket.id, data });
    });

    socket.on('chat-message', async ({ roomId, userId, content }) => {
      await prisma.message.create({ data: { roomId, senderId: userId, content }});
      io.to(roomId).emit('chat-message', { roomId, userId, content, createdAt: new Date() });
    });

    socket.on('send-gift', async ({ fromUserId, toUserId, giftId }) => {
      const gift = await prisma.gift.findUnique({ where: { id: giftId }});
      if (!gift) return socket.emit('error', 'Gift not found');

      await prisma.user.update({ where: { id: fromUserId }, data: { coins: { decrement: gift.price } }});
      await prisma.giftReceive.create({ data: { giftId, fromUserId, toUserId }});

      if (socket.roomId) {
        io.to(socket.roomId).emit('gift-received', { fromUserId, toUserId, gift });
      }
    });

    socket.on('disconnect', () => {
      if (socket.roomId) socket.to(socket.roomId).emit('user-left', { userId: socket.userId });
      console.log('socket disconnected', socket.id);
    });
  });
};
