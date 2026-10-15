const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.post('/', roomController.createRoom);
router.get('/', roomController.listRooms);
router.get('/:id', roomController.getRoom);
router.post('/:id/join', roomController.joinRoom);

module.exports = router;
