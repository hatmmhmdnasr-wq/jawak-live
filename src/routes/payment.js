const express = require('express');
const router = express.Router();
const paymentMock = require('../services/paymentMock');

router.post('/topup', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) return res.status(400).json({ error: 'userId and amount required' });
    const result = await paymentMock.mockTopUp({ userId, amount });
    return res.json({ ok: true, result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
