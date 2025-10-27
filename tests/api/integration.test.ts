import { NextRequest } from "next/server";
import { GET, POST } from "../../app/api/todos/route";
import { PUT, DELETE } from "../../app/api/todos/[id]/route";
import { resetTodosData, getTodosData } from "../setup";

describe("API Integration Tests", () => {
  beforeEach(() => {
    resetTodosData();
  });

  describe("Complete CRUD Workflow", () => {
    it("should perform complete CRUD operations", async () => {
      // 1. GET - Read initial todos
      const getResponse = await GET();
      const getData = await getResponse.json();
      expect(getResponse.status).toBe(200);
      expect(getData.data).toHaveLength(2);

      // 2. POST - Create new todo
      const newTodo = {
        title: "Integration Test Todo",
        description: "Created during integration test",
      };

      const createRequest = new NextRequest("http://localhost:3000/api/todos", {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: { "Content-Type": "application/json" },
      });

      const createResponse = await POST(createRequest);
      const createData = await createResponse.json();
      expect(createResponse.status).toBe(201);
      expect(createData.data.title).toBe(newTodo.title);
      const newTodoId = createData.data.id;

      // 3. GET - Verify todo was created
      const getAfterCreateResponse = await GET();
      const getAfterCreateData = await getAfterCreateResponse.json();
      expect(getAfterCreateData.data).toHaveLength(3);

      // 4. PUT - Update the created todo
      const updateData = {
        title: "Updated Integration Test Todo",
        completed: true,
      };

      const updateRequest = new NextRequest(
        `http://localhost:3000/api/todos/${newTodoId}`,
        {
          method: "PUT",
          body: JSON.stringify(updateData),
          headers: { "Content-Type": "application/json" },
        }
      );

      const updateParams = Promise.resolve({ id: newTodoId });
      const updateResponse = await PUT(updateRequest, { params: updateParams });
      const updateResponseData = await updateResponse.json();
      expect(updateResponse.status).toBe(200);
      expect(updateResponseData.data.title).toBe(updateData.title);
      expect(updateResponseData.data.completed).toBe(true);

      // 5. DELETE - Delete the created todo
      const deleteRequest = new NextRequest(
        `http://localhost:3000/api/todos/${newTodoId}`,
        {
          method: "DELETE",
        }
      );

      const deleteParams = Promise.resolve({ id: newTodoId });
      const deleteResponse = await DELETE(deleteRequest, {
        params: deleteParams,
      });
      const deleteData = await deleteResponse.json();
      expect(deleteResponse.status).toBe(200);
      expect(deleteData.data.id).toBe(newTodoId);

      // 6. GET - Verify todo was deleted
      const getAfterDeleteResponse = await GET();
      const getAfterDeleteData = await getAfterDeleteResponse.json();
      expect(getAfterDeleteData.data).toHaveLength(2);
    });

    it("should handle multiple todos creation and management", async () => {
      // Create multiple todos
      const todos = [
        { title: "Todo 1", description: "Description 1" },
        { title: "Todo 2", description: "Description 2" },
        { title: "Todo 3", description: "Description 3" },
      ];

      const createdIds = [];

      for (const todo of todos) {
        const request = new NextRequest("http://localhost:3000/api/todos", {
          method: "POST",
          body: JSON.stringify(todo),
          headers: { "Content-Type": "application/json" },
        });

        const response = await POST(request);
        const data = await response.json();
        expect(response.status).toBe(201);
        createdIds.push(data.data.id);
      }

      // Verify all todos were created
      const getResponse = await GET();
      const getData = await getResponse.json();
      expect(getData.data).toHaveLength(5); // 2 initial + 3 new

      // Update all created todos to completed
      for (const id of createdIds) {
        const updateRequest = new NextRequest(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({ completed: true }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const updateParams = Promise.resolve({ id });
        const updateResponse = await PUT(updateRequest, {
          params: updateParams,
        });
        expect(updateResponse.status).toBe(200);
      }

      // Delete all created todos
      for (const id of createdIds) {
        const deleteRequest = new NextRequest(
          `http://localhost:3000/api/todos/${id}`,
          {
            method: "DELETE",
          }
        );

        const deleteParams = Promise.resolve({ id });
        const deleteResponse = await DELETE(deleteRequest, {
          params: deleteParams,
        });
        expect(deleteResponse.status).toBe(200);
      }

      // Verify all todos were deleted
      const finalGetResponse = await GET();
      const finalGetData = await finalGetResponse.json();
      expect(finalGetData.data).toHaveLength(2); // Back to initial 2
    });
  });

  describe("Error Handling Integration", () => {
    it("should handle concurrent operations gracefully", async () => {
      // Create multiple todos simultaneously
      const promises = Array.from({ length: 5 }, (_, i) => {
        const request = new NextRequest("http://localhost:3000/api/todos", {
          method: "POST",
          body: JSON.stringify({
            title: `Concurrent Todo ${i + 1}`,
            description: `Concurrent Description ${i + 1}`,
          }),
          headers: { "Content-Type": "application/json" },
        });
        return POST(request);
      });

      const responses = await Promise.all(promises);

      // All should succeed
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      // Verify all were created
      const getResponse = await GET();
      const getData = await getResponse.json();
      expect(getData.data).toHaveLength(7); // 2 initial + 5 new
    });

    it("should handle invalid operations gracefully", async () => {
      // Try to update non-existent todo
      const updateRequest = new NextRequest(
        "http://localhost:3000/api/todos/999",
        {
          method: "PUT",
          body: JSON.stringify({ title: "Updated Title" }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const updateParams = Promise.resolve({ id: "999" });
      const updateResponse = await PUT(updateRequest, { params: updateParams });
      expect(updateResponse.status).toBe(404);

      // Try to delete non-existent todo
      const deleteRequest = new NextRequest(
        "http://localhost:3000/api/todos/999",
        {
          method: "DELETE",
        }
      );

      const deleteParams = Promise.resolve({ id: "999" });
      const deleteResponse = await DELETE(deleteRequest, {
        params: deleteParams,
      });
      expect(deleteResponse.status).toBe(404);

      // Try to create todo with invalid data
      const createRequest = new NextRequest("http://localhost:3000/api/todos", {
        method: "POST",
        body: JSON.stringify({ title: "" }), // Empty title
        headers: { "Content-Type": "application/json" },
      });

      const createResponse = await POST(createRequest);
      expect(createResponse.status).toBe(400);
    });
  });
});
