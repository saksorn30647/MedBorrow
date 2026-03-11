const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getRequests, createRequest, updateRequestStatus } = require('../controllers/requestController');
router.get('/',             auth, getRequests);
router.post('/',            auth, createRequest);
router.patch('/:id/status', auth, updateRequestStatus);
module.exports = router;
