import { NextRequest } from 'next/server';
import { PUT, DELETE } from '../../app/api/todos/[id]/route';
import { resetTodosData, getTodosData, setTodosData } from '../setup';

describe('/api/todos/[id]', () => {
  beforeEach(() => {
    resetTodosData();
  });

  describe('PUT /api/todos/[id]', () => {
    it('should update todo successfully', async () => {
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true
      };

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(updateData.title);
      expect(data.data.description).toBe(updateData.description);
      expect(data.data.completed).toBe(true);
      expect(data.data.id).toBe('1');
      expect(data.data.updatedAt).toBeDefined();
      expect(data.message).toBe('Todo updated successfully');
    });

    it('should update only title', async () => {
      const updateData = {
        title: 'Only Title Updated'
      };

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(updateData.title);
      expect(data.data.description).toBe('Test Description 1'); // Original description
      expect(data.data.completed).toBe(false); // Original completed status
    });

    it('should update only description', async () => {
      const updateData = {
        description: 'Only Description Updated'
      };

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Test Todo 1'); // Original title
      expect(data.data.description).toBe(updateData.description);
      expect(data.data.completed).toBe(false); // Original completed status
    });

    it('should update only completed status', async () => {
      const updateData = {
        completed: true
      };

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Test Todo 1'); // Original title
      expect(data.data.description).toBe('Test Description 1'); // Original description
      expect(data.data.completed).toBe(true);
    });

    it('should trim title and description when updating', async () => {
      const updateData = {
        title: '  Trimmed Updated Title  ',
        description: '  Trimmed Updated Description  '
      };

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe('Trimmed Updated Title');
      expect(data.data.description).toBe('Trimmed Updated Description');
    });

    it('should handle boolean conversion for completed field', async () => {
      const updateData = {
        completed: 'true' // String instead of boolean
      };

      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.completed).toBe(true);
    });

    it('should return 404 when todo not found', async () => {
      const updateData = {
        title: 'Updated Title'
      };

      const params = Promise.resolve({ id: '999' });
      const request = new NextRequest('http://localhost:3000/api/todos/999', {
        method: 'PUT',
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Todo not found');
    });

    it('should handle malformed JSON', async () => {
      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'PUT',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await PUT(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Failed to update todo');
    });
  });

  describe('DELETE /api/todos/[id]', () => {
    it('should delete todo successfully', async () => {
      const params = Promise.resolve({ id: '1' });
      const request = new NextRequest('http://localhost:3000/api/todos/1', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe('1');
      expect(data.data.title).toBe('Test Todo 1');
      expect(data.message).toBe('Todo deleted successfully');
    });

    it('should return 404 when todo not found', async () => {
      const params = Promise.resolve({ id: '999' });
      const request = new NextRequest('http://localhost:3000/api/todos/999', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Todo not found');
    });

    it('should handle invalid id format', async () => {
      const params = Promise.resolve({ id: 'invalid-id' });
      const request = new NextRequest('http://localhost:3000/api/todos/invalid-id', {
        method: 'DELETE',
      });

      const response = await DELETE(request, { params });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Todo not found');
    });
  });
});
