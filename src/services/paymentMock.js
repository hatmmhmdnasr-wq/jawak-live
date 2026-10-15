const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.mockTopUp = async ({ userId, amount }) => {
  const coins = Math.floor(Number(amount) * 100);
  const user = await prisma.user.update({
    where: { id: userId },
    data: { coins: { increment: coins } }
  });
  return { user, coinsAdded: coins };
};
