const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listGifts = async (req, res) => {
  try {
    const gifts = await prisma.gift.findMany({ orderBy: { price: 'asc' }});
    return res.json({ gifts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.createGift = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'name and price required' });
    const gift = await prisma.gift.create({ data: { name, price: Number(price), imageUrl: imageUrl || '' }});
    return res.json({ gift });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.sendGift = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromUserId, toUserId } = req.body;
    if (!fromUserId || !toUserId) return res.status(400).json({ error: 'fromUserId and toUserId required' });

    const gift = await prisma.gift.findUnique({ where: { id }});
    if (!gift) return res.status(404).json({ error: 'Gift not found' });

    const sender = await prisma.user.findUnique({ where: { id: fromUserId }});
    if (!sender) return res.status(404).json({ error: 'Sender not found' });
    if (sender.coins < gift.price) return res.status(400).json({ error: 'Insufficient coins' });

    await prisma.$transaction([
      prisma.user.update({ where: { id: fromUserId }, data: { coins: { decrement: gift.price } }}),
      prisma.user.update({ where: { id: toUserId }, data: { coins: { increment: Math.floor(gift.price * 0.5) } }}),
      prisma.giftReceive.create({ data: { giftId: id, fromUserId, toUserId }})
    ]);

    return res.json({ ok: true, gift });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
