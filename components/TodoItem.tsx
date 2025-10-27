"use client";

import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onUpdate(todo.id, { completed: !todo.completed });
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    if (editTitle.trim() === "") return;

    setIsLoading(true);
    try {
      await onUpdate(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(todo.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting todo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
        todo.completed ? "border-green-500 bg-green-50" : "border-blue-500"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Todo title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Todo description"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isLoading || editTitle.trim() === ""}
                  className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3
                className={`text-lg font-semibold ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {todo.title}
              </h3>
              {todo.description && (
                <p
                  className={`mt-1 text-sm ${
                    todo.completed ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {todo.description}
                </p>
              )}
              <div className="mt-2 text-xs text-gray-400">
                Created: {new Date(todo.createdAt).toLocaleDateString()}
                {todo.updatedAt !== todo.createdAt && (
                  <span className="ml-2">
                    • Updated: {new Date(todo.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handleToggleComplete}
              disabled={isLoading}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                todo.completed
                  ? "bg-yellow-500 text-white hover:bg-yellow-600"
                  : "bg-green-500 text-white hover:bg-green-600"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {todo.completed ? "Undo" : "Complete"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isLoading}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Todo"
        message={`Are you sure you want to delete "${todo.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}
