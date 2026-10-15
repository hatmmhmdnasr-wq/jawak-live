const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createRoom = async (req, res) => {
  try {
    const { name, isPrivate, hostId } = req.body;
    if (!name || !hostId) return res.status(400).json({ error: 'name and hostId required' });
    const room = await prisma.room.create({ data: { name, isPrivate: !!isPrivate, hostId }});
    return res.json({ room });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.listRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
    return res.json({ rooms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await prisma.room.findUnique({ where: { id }, include: { participants: true, messages: { orderBy: { createdAt: 'asc' } } }});
    if (!room) return res.status(404).json({ error: 'Room not found' });
    return res.json({ room });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, asSpeaker } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId required' });
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    const participant = await prisma.roomParticipant.create({ data: { roomId: id, userId, isSpeaker: !!asSpeaker }});
    return res.json({ participant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
