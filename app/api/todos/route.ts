import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'todos.json');

// Helper function to read todos from JSON file
function readTodos() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading todos:', error);
    return [];
  }
}

// Helper function to write todos to JSON file
function writeTodos(todos: any[]) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(todos, null, 2));
  } catch (error) {
    console.error('Error writing todos:', error);
    throw error;
  }
}

// GET /api/todos - Fetch all todos
export async function GET() {
  try {
    const todos = readTodos();
    return NextResponse.json({
      success: true,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description } = body;

    // Validate required fields
    if (!title || title.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      );
    }

    const todos = readTodos();
    
    // Generate new ID
    const newId = todos.length > 0 ? Math.max(...todos.map(t => parseInt(t.id))) + 1 : 1;
    
    const newTodo = {
      id: newId.toString(),
      title: title.trim(),
      description: description?.trim() || '',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);
    writeTodos(todos);

    return NextResponse.json({
      success: true,
      data: newTodo,
      message: 'Todo created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
