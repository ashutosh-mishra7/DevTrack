import express from 'express';
import Todo from '../models/Todo.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user todos
// @route   GET /api/todos
// @access  Private
const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ user: req.user._id });

  // Generate Smart Suggestions if total todos is low
  if (todos.length < 5) {
    const allSuggestions = [
      ['Plan your week', 'Review old PRs', 'Solve 1 Easy LeetCode'],
      ['Start a new project', 'Make a GitHub commit', 'Read a tech article'],
      ['Solve 2 LeetCode problems', 'Refactor old code', 'Update LinkedIn profile'],
      ['Write a tech blog post', 'Contribute to open source', 'Learn a new framework'],
      ['Optimize code performance', 'Post something on LinkedIn', 'Solve 1 Medium LeetCode'],
      ['Code review day', 'Improve your coding streak', 'Write unit tests'],
      ['Participate in a weekly contest', 'Clean up local branches', 'Read official documentation'],
    ];
    const today = new Date().getDay();
    const suggestions = allSuggestions[today];
    
    for (const sug of suggestions) {
      const exists = todos.find(t => t.task === sug);
      if (!exists) {
        todos.push({ task: sug, isSuggestion: true, _id: 'sug_' + Math.random().toString(36).substr(2, 9) });
      }
    }
  }

  res.json(todos);
});

// @desc    Create a todo
// @route   POST /api/todos
// @access  Private
const createTodo = asyncHandler(async (req, res) => {
  const { task } = req.body;

  if (!task) {
    res.status(400);
    throw new Error('Please add a task');
  }

  const todo = await Todo.create({
    task,
    user: req.user._id,
  });

  res.status(201).json(todo);
});

// @desc    Update a todo (Complete/Uncomplete)
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
  if(req.body.task) {
    todo.task = req.body.task;
  }
  
  const updatedTodo = await todo.save();

  res.json(updatedTodo);
});

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  if (todo.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await todo.deleteOne();

  res.json({ id: req.params.id });
});

router.route('/').get(protect, getTodos).post(protect, createTodo);
router.route('/:id').put(protect, updateTodo).delete(protect, deleteTodo);

export default router;
