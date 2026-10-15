const express = require('express');
const router = express.Router();
const giftController = require('../controllers/giftController');

router.get('/', giftController.listGifts);
router.post('/', giftController.createGift);
router.post('/:id/send', giftController.sendGift);

module.exports = router;
