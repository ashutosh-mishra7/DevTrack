import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    task: {
      type: String,
      required: [true, 'Please add a task'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isSuggestion: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
