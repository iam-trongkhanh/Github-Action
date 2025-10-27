import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "todos.json");

// Helper function to read todos from JSON file
function readTodos() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading todos:", error);
    return [];
  }
}

// Helper function to write todos to JSON file
function writeTodos(todos: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error("Error writing todos:", error);
    throw error;
  }
}

// PUT /api/todos/[id] - Update a todo by id
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, completed } = body;

    const todos = readTodos();
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 }
      );
    }

    // Update todo with provided fields
    const updatedTodo = {
      ...todos[todoIndex],
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(completed !== undefined && { completed: Boolean(completed) }),
      updatedAt: new Date().toISOString(),
    };

    todos[todoIndex] = updatedTodo;
    writeTodos(todos);

    return NextResponse.json({
      success: true,
      data: updatedTodo,
      message: "Todo updated successfully",
    });
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// DELETE /api/todos/[id] - Delete a todo by id
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const todos = readTodos();
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Todo not found" },
        { status: 404 }
      );
    }

    const deletedTodo = todos[todoIndex];
    todos.splice(todoIndex, 1);
    writeTodos(todos);

    return NextResponse.json({
      success: true,
      data: deletedTodo,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
