# Express MySQL Authentication API

A complete Node.js authentication API with Express and MySQL. This project provides a robust backend API with user authentication, authorization, and profile management.

## Features

- User registration and login
- JWT-based authentication
- Role-based authorization (user/admin)
- User profile management
- MySQL database integration
- API documentation with Swagger
- Password hashing with bcrypt
- Input validation and error handling
- Environment-based configuration

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL (v5.7 or later)

### Installation

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
   ```
   cp .env.example .env
   ```
4. Update the `.env` file with your configuration

### Database Setup

1. Create a MySQL database
2. Run database migrations
   ```
   npm run migrate
   ```
3. Seed the database with sample data (optional)
   ```
   npm run seed
   ```

### Running the App

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Documentation

Once the server is running, you can access the API documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get current user profile (requires authentication)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## License

This project is licensed under the MIT License.