// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel');

router.get('/:userId', async (req, res) => {
  const notifications = await Notification.find({ userId: req.params.userId, read: false });
  res.json(notifications);
});

router.post('/mark-read/:id', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

module.exports = router;