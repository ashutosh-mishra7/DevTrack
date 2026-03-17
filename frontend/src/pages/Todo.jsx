import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  CheckCircle2, Circle, Trash2, Plus, 
  Lightbulb, Loader2, Sparkles 
} from 'lucide-react';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data } = await api.get('/todos');
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setActionLoading('add');

    try {
      const { data } = await api.post('/todos', { task: newTask });
      setTodos([data, ...todos]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding todo', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptSuggestion = async (suggestionText, tempId) => {
    setActionLoading(tempId);
    try {
      const { data } = await api.post('/todos', { task: suggestionText });
      setTodos([data, ...todos.filter(t => t._id !== tempId)]);
    } catch (error) {
      console.error('Error accepting suggestion', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleTodo = async (id, currentStatus) => {
    setActionLoading(id);
    try {
      const { data } = await api.put(`/todos/${id}`, { completed: !currentStatus });
      setTodos(todos.map(t => (t._id === id ? data : t)));
    } catch (error) {
      console.error('Error toggling todo', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTodo = async (id, isSuggestion) => {
    setActionLoading(id);
    if (isSuggestion) {
      setTodos(todos.filter(t => t._id !== id));
      setActionLoading(null);
      return;
    }

    try {
      await api.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting todo', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-white/50 h-[80vh] rounded-xl flex items-center justify-center text-[var(--color-steelblue)]">Loading tasks...</div>;
  }

  const regularTodos = todos.filter(t => !t.isSuggestion);
  const suggestionTodos = todos.filter(t => t.isSuggestion);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-darkslate)]">Daily Tasks</h1>
          <p className="text-[var(--color-steelblue)] mt-2">Manage your goals and maintain your streak.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Todo List */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleAddTodo} className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done today?"
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--color-warmbeige)] focus:ring-2 focus:ring-[var(--color-softblue)] focus:border-transparent outline-none transition-all placeholder:text-gray-400 shadow-sm"
            />
            <button
              type="submit"
              disabled={actionLoading === 'add' || !newTask.trim()}
              className="bg-[var(--color-steelblue)] hover:bg-[var(--color-softblue)] text-white px-6 rounded-xl flex items-center justify-center transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {actionLoading === 'add' ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
            </button>
          </form>

          <div className="bg-white rounded-2xl shadow-sm border border-[var(--color-warmbeige)] overflow-hidden">
            {regularTodos.length === 0 ? (
               <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                 <CheckCircle2 size={48} className="mb-4 text-[var(--color-lightsky)]" />
                 <p>No active tasks. Add one or pick a suggestion!</p>
               </div>
            ) : (
              <ul className="divide-y divide-[var(--color-warmbeige)]/50">
                {regularTodos.map(todo => (
                  <li key={todo._id} className="flex flex-row p-4 items-center gap-4 hover:bg-[var(--color-lightsky)]/20 transition-colors group">
                    <button 
                      onClick={() => handleToggleTodo(todo._id, todo.completed)}
                      disabled={actionLoading === todo._id}
                      className="text-[var(--color-steelblue)] hover:text-[var(--color-softblue)] transition-colors shrink-0"
                    >
                      {actionLoading === todo._id ? (
                        <Loader2 className="animate-spin" size={24} />
                      ) : todo.completed ? (
                        <CheckCircle2 size={24} className="text-green-500" />
                      ) : (
                         <Circle size={24} />
                      )}
                    </button>
                    
                    <span className={`flex-1 text-lg transition-all duration-300 ${todo.completed ? 'text-gray-400 line-through' : 'text-[var(--color-darkslate)]'}`}>
                      {todo.task}
                    </span>

                    <button 
                      onClick={() => handleDeleteTodo(todo._id, false)}
                      disabled={actionLoading === todo._id}
                      className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Smart Suggestions Panel */}
        {suggestionTodos.length > 0 && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[var(--color-softblue)] to-[var(--color-steelblue)] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                <Lightbulb size={120} />
              </div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4 relative z-10">
                <Sparkles size={20} className="text-yellow-300" /> Smart Suggestions
              </h3>
              <ul className="space-y-3 relative z-10">
                 {suggestionTodos.map(sug => (
                    <li key={sug._id} className="bg-white/10 hover:bg-white/20 border border-white/20 p-3 rounded-lg flex items-start gap-3 transition-colors group cursor-pointer"
                        onClick={() => handleAcceptSuggestion(sug.task, sug._id)}>
                       <Plus size={18} className="shrink-0 mt-0.5" />
                       <span className="text-sm font-medium leading-tight select-none">{sug.task}</span>
                    </li>
                 ))}
               </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Todo;
