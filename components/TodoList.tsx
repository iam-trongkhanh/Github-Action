'use client';

import { useState, useEffect } from 'react';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos from API
  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/todos');
      const data = await response.json();
      
      if (data.success) {
        setTodos(data.data);
      } else {
        setError(data.error || 'Failed to fetch todos');
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to fetch todos');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new todo
  const handleCreateTodo = async (title: string, description: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTodos(prev => [...prev, data.data]);
      } else {
        setError(data.error || 'Failed to create todo');
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      setError('Failed to create todo');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update todo
  const handleUpdateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTodos(prev => prev.map(todo => 
          todo.id === id ? data.data : todo
        ));
      } else {
        setError(data.error || 'Failed to update todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Failed to update todo');
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id: string) => {
    try {
      setError(null);
      
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      } else {
        setError(data.error || 'Failed to delete todo');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo');
    }
  };

  // Load todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Calculate statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Loading todos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo List</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTodos}</div>
            <div className="text-sm text-gray-600">Total Todos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedTodos}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pendingTodos}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Add Todo Form */}
        <div className="mb-8">
          <TodoForm onSubmit={handleCreateTodo} isLoading={isSubmitting} />
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No todos yet</h3>
              <p className="text-gray-600">Create your first todo to get started!</p>
            </div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
