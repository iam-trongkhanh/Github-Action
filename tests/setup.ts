import fs from "fs";
import path from "path";

// Mock file system operations
const mockTodos = [
  {
    id: "1",
    title: "Test Todo 1",
    description: "Test Description 1",
    completed: false,
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Test Todo 2",
    description: "Test Description 2",
    completed: true,
    createdAt: "2024-01-14T09:30:00.000Z",
    updatedAt: "2024-01-15T11:45:00.000Z",
  },
];

let todosData = [...mockTodos];

// Mock fs module
jest.mock("fs", () => ({
  readFileSync: jest.fn(() => JSON.stringify(todosData)),
  writeFileSync: jest.fn((path: string, data: string) => {
    todosData = JSON.parse(data);
  }),
}));

// Mock path module
jest.mock("path", () => ({
  join: jest.fn((...args) => args.join("/")),
}));

// Reset todos data before each test
beforeEach(() => {
  todosData = [...mockTodos];
  jest.clearAllMocks();
});

// Helper function to reset todos data
export const resetTodosData = () => {
  todosData = [...mockTodos];
};

// Helper function to get current todos data
export const getTodosData = () => todosData;

// Helper function to set todos data
export const setTodosData = (newTodos: any[]) => {
  todosData = newTodos;
};
