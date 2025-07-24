const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Task = require('../models/Task');


router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', protect, async (req, res) => {
  const { name } = req.body;
  try {
    const task = new Task({
      name,
      userId: req.user._id,
    });
    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task && task.userId.toString() === req.user._id.toString()) {
      task.completed = !task.completed;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task && task.userId.toString() === req.user._id.toString()) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;