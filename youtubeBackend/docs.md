# YouTube Backend API Documentation

## Table of Contents

- [Overview](#overview)
- [Base URL](#base-url)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

This is the API documentation for the YouTube Backend service. The API provides user authentication, user management, and other backend services.

## Base URL

```
http://localhost:4000
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header.

**Header Format:**

```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints
### 1. Welcome Endpoint
### 1. Welcome Endpoint
#### GET /

Returns a welcome message for the API.

**Response:**

```json
{
  "message": "Welcome to YouTube Backend API"
}
```

---

### 2. User Authentication

#### POST /user/signup

Creates a new user account.

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "dateOfBirth": "1990-01-01"
}
```
**Response (Success - 201):**

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePicture": null,
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "isActive": true,
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 400):**

```json
{
  "success": false,
  "message": "User with this email or username already exists"
}
```

---

#### POST /user/signin
Authenticates a user and returns a JWT token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePicture": null,
      "dateOfBirth": "1990-01-01T00:00:00.000Z",
      "isActive": true,
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 401):**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```


#### POST /user/uploadimage

Uploads and updates a user's profile picture. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fileurl": "https://example.com/profile-picture.jpg"
}
```
**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Profile Picture Saved"
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "File URL is required"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

**Response (Error - 404):**
{
  "success": false,
  "message": "User not found"
}
```

---

## User Model Schema

### User Fields

| ---------------- | ------- | -------- | -------------------------- | -------------------------- |
| `username`       | String  | Yes      | Unique username            | 3-30 characters, unique    |
| `email`          | String  | Yes      | User's email address       | Valid email format, unique |
| `password`       | String  | Yes      | User's password            | Minimum 6 characters       |
| `profilePicture` | String  | No       | URL to profile picture     | Default: null              |
| `dateOfBirth`    | Date    | No       | User's date of birth       | Valid date format          |
| `isActive`       | Boolean | No       | Account status             | Default: true              |
| `isVerified`     | Boolean | No       | Email verification status  | Default: false             |
| `createdAt`      | Date    | Auto     | Account creation timestamp | Auto-generated             |
| `updatedAt`      | Date    | Auto     | Last update timestamp      | Auto-generated             |

---

## Error Handling

### HTTP Status Codes

| Status Code | Description                                      |
| ----------- | ------------------------------------------------ |
| 200         | OK - Request successful                          |
| 201         | Created - Resource created successfully          |
| 400         | Bad Request - Invalid input data                 |
| 401         | Unauthorized - Authentication required or failed |
| 404         | Not Found - Resource not found                   |
| 500         | Internal Server Error - Server error             |

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

---

## Examples

### Complete Signup Flow

1. **Create User Account**

```bash
curl -X POST http://localhost:4000/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "dateOfBirth": "1990-01-01"
  }'
```

2. **Login with Created Account**

```bash
curl -X POST http://localhost:4000/user/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Using JWT Token

After successful login, use the returned token for authenticated requests:

```bash
curl -X GET http://localhost:4000/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Upload Profile Picture

Update user's profile picture using the JWT token:

```bash
curl -X POST http://localhost:4000/user/uploadimage \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "fileurl": "https://example.com/profile-picture.jpg"
  }'
```

---

## Environment Variables

Create a `.env` file in your project root:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/youtubeBackend
JWT_SECRET=your-super-secret-jwt-key-here
```

---

## Dependencies

The following packages are required:

```json
{
  "express": "^5.1.0",
  "mongoose": "^8.17.1",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^17.2.1"
}
```

---

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

### Server Status

- **Running**: 🚀 Server is running on port 4000
- **Database**: ✅ MongoDB connected successfully
- **Health Check**: Available at `http://localhost:4000/`

---

## Notes

- **Password Security**: Passwords are currently stored as plain text (not recommended for production)
- **JWT Expiration**: Tokens expire after 7 days
- **CORS**: Enabled for cross-origin requests
- **Database**: MongoDB with Mongoose ODM
- **Validation**: Input validation using Mongoose schemas

---

## Support

For API support or questions, please refer to the project documentation or contact the development team.
