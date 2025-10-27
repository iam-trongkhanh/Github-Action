# Todo List App - Fullstack Next.js Application

A complete fullstack Todo List application built with Next.js, featuring API routes for backend functionality and a modern React frontend with TailwindCSS.

## 🚀 Features

### Backend (API Routes)
- **GET** `/api/todos` - Fetch all todos
- **POST** `/api/todos` - Create a new todo
- **PUT** `/api/todos/[id]` - Update a todo by ID
- **DELETE** `/api/todos/[id]` - Delete a todo by ID
- JSON file storage (no database required)
- Comprehensive error handling and validation

### Frontend
- Modern, responsive UI with TailwindCSS
- Real-time todo management
- Beautiful confirmation modal for deletions
- Form validation and error handling
- Statistics dashboard
- Mobile-friendly design

### Testing & CI/CD
- Complete test suite with Jest
- Unit tests for all API endpoints
- Integration tests for CRUD operations
- GitHub Actions CI/CD pipeline
- Code coverage reporting

## 📁 Project Structure

```
app-for-testing/
├── app/
│   ├── api/todos/
│   │   ├── route.ts          # GET, POST /api/todos
│   │   └── [id]/route.ts     # PUT, DELETE /api/todos/[id]
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── TodoForm.tsx          # Form for adding new todos
│   ├── TodoItem.tsx          # Individual todo component
│   ├── TodoList.tsx          # Main todo list component
│   └── ConfirmModal.tsx      # Confirmation modal
├── data/
│   └── todos.json            # JSON file for data storage
├── tests/
│   ├── api/
│   │   ├── todos.test.ts     # Tests for main todos API
│   │   ├── todos-id.test.ts  # Tests for individual todo API
│   │   └── integration.test.ts # Integration tests
│   └── setup.ts              # Test setup and mocks
├── .github/workflows/
│   └── ci-cd.yml             # GitHub Actions pipeline
└── jest.config.js             # Jest configuration
```

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd app-for-testing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI/CD
npm run test:ci
```

### Test Coverage
- **Statements**: 85.52%
- **Branches**: 95.45%
- **Functions**: 100%
- **Lines**: 84.93%

## 📡 API Documentation

### GET /api/todos
Fetch all todos.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "Learn Next.js",
      "description": "Complete the Next.js tutorial",
      "completed": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /api/todos
Create a new todo.

**Request Body:**
```json
{
  "title": "New Todo",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2",
    "title": "New Todo",
    "description": "Optional description",
    "completed": false,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Todo created successfully"
}
```

### PUT /api/todos/[id]
Update a todo by ID.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "completed": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Updated Title",
    "description": "Updated Description",
    "completed": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  },
  "message": "Todo updated successfully"
}
```

### DELETE /api/todos/[id]
Delete a todo by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Deleted Todo",
    "description": "This todo was deleted",
    "completed": false,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Todo deleted successfully"
}
```

## 🔄 CI/CD Pipeline

The project includes a complete GitHub Actions CI/CD pipeline that:

1. **Tests** - Runs linting and tests on multiple Node.js versions
2. **Builds** - Creates production build
3. **Deploys** - Automatically deploys to Vercel on main branch

### Pipeline Features
- Multi-version testing (Node.js 18.x, 20.x)
- Code coverage reporting
- Automatic deployment to Vercel
- Build artifact management

## 🎯 Usage Examples

### Frontend Usage
1. **Add Todo**: Fill in the form and click "Add Todo"
2. **Edit Todo**: Click "Edit" button, modify fields, click "Save"
3. **Complete Todo**: Click "Complete" button
4. **Delete Todo**: Click "Delete" button, confirm in modal

### API Usage Examples

**Create a todo:**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "API Test Todo", "description": "Created via API"}'
```

**Update a todo:**
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Delete a todo:**
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

## 🛡️ Error Handling

The application includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Todo not found
- **500 Internal Server Error**: Server-side errors
- **JSON Validation**: Malformed request bodies
- **Field Validation**: Required fields and data types

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically via CI/CD pipeline

### Manual Deployment
```bash
npm run build
npm start
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue in the GitHub repository.