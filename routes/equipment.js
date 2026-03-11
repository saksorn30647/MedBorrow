const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllEquipment, getEquipmentById, createEquipment } = require('../controllers/equipmentController');
router.get('/',    auth, getAllEquipment);
router.get('/:id', auth, getEquipmentById);
router.post('/',   auth, createEquipment);
module.exports = router;
