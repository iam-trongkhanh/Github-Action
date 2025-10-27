import { NextRequest } from 'next/server';
import { GET, POST } from '../../app/api/todos/route';
import { resetTodosData, getTodosData, setTodosData } from '../setup';

describe('/api/todos', () => {
  beforeEach(() => {
    resetTodosData();
  });

  describe('GET /api/todos', () => {
    it('should return all todos successfully', async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.count).toBe(2);
      expect(data.data[0]).toHaveProperty('id');
      expect(data.data[0]).toHaveProperty('title');
      expect(data.data[0]).toHaveProperty('description');
      expect(data.data[0]).toHaveProperty('completed');
      expect(data.data[0]).toHaveProperty('createdAt');
      expect(data.data[0]).toHaveProperty('updatedAt');
    });

    it('should return empty array when no todos exist', async () => {
      setTodosData([]);
      
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(0);
      expect(data.count).toBe(0);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo successfully', async () => {
      const newTodo = {
        title: 'New Test Todo',
        description: 'New Test Description'
      };

      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(newTodo.title);
      expect(data.data.description).toBe(newTodo.description);
      expect(data.data.completed).toBe(false);
      expect(data.data.id).toBeDefined();
      expect(data.data.createdAt).toBeDefined();
      expect(data.data.updatedAt).toBeDefined();
      expect(data.message).toBe('Todo created successfully');
    });

    it('should create todo with only title (no description)', async () => {
      const newTodo = {
        title: 'Todo without description'
      };

      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(newTodo.title);
      expect(data.data.description).toBe('');
      expect(data.data.completed).toBe(false);
    });

    it('should return 400 when title is missing', async () => {
      const newTodo = {
        description: 'Description without title'
      };

      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Title is required');
    });

    it('should return 400 when title is empty string', async () => {
      const newTodo = {
        title: '',
        description: 'Description with empty title'
      };

      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Title is required');
    });

    it('should return 400 when title is only whitespace', async () => {
      const newTodo = {
        title: '   ',
        description: 'Description with whitespace title'
      };

      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Title is required');
    });

    it('should trim title and description', async () => {
      const newTodo = {
        title: '  Trimmed Title  ',
        description: '  Trimmed Description  '
      };

      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: JSON.stringify(newTodo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Trimmed Title');
      expect(data.data.description).toBe('Trimmed Description');
    });

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/todos', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to create todo');
    });
  });
});
