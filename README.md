[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19897702&assignment_repo_type=AssignmentRepo)
# MERN Stack Blog Application

## Project Overview

This project is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) blog application. It demonstrates seamless integration between front-end and back-end components, including database operations, API communication, authentication, image uploads, comments, and state management. Users can register, log in, create/edit/delete blog posts, upload featured images, comment on posts, and filter/search posts by category or keyword.

---

## File Structure

```
week-4-mern-integration-assignment-KamungeD/
│
├── client/
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── components/
│       │   ├── PostList.jsx
│       │   ├── PostForm.jsx
│       │   ├── PostDetail.jsx
│       │   ├── LoginForm.jsx
│       │   ├── RegisterForm.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── ...
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Posts.jsx
│       │   ├── PostNew.jsx
│       │   ├── PostEdit.jsx
│       │   ├── PostDetailPage.jsx
│       │   └── Profile.jsx
│       ├── services/
│       │   └── api.js
│       ├── hooks/
│       │   └── useApi.js
│       └── ...
│
├── server/
│   ├── server.js
│   ├── models/
│   │   ├── Post.js
│   │   ├── Category.js
│   │   └── User.js
│   ├── routes/
│   │   ├── posts.js
│   │   ├── categories.js
│   │   ├── auth.js
│   │   └── ...
│   ├── middleware/
│   │   └── ...
│   ├── uploads/
│   └── ...
│
├── README.md
├── package.json
├── vite.config.js
└── ...
```

---

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or pnpm

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd week-4-mern-integration-assignment-KamungeD
```

### 2. Set Up the Server

```sh
cd server
cp .env.example .env   # Edit .env with your MongoDB URI and JWT secret
pnpm install           # or npm install
pnpm run dev           # or npm run dev
```

### 3. Set Up the Client

```sh
cd ../client
cp .env.example .env   # (if provided, otherwise set VITE_API_URL if needed)
pnpm install           # or npm install
pnpm run dev           # or npm run dev
```

### 4. Access the App

- Client: [http://localhost:5173](http://localhost:5173)
- Server API: [http://localhost:5000/api](http://localhost:5000/api)

---

## API Documentation

### Authentication

- `POST /api/auth/register` — Register a new user  
  **Body:** `{ username, password }`
- `POST /api/auth/login` — Login  
  **Body:** `{ username, password }`  
  **Response:** `{ token }`

### Posts

- `GET /api/posts` — Get all posts (supports pagination, search, category)
- `GET /api/posts/:id` — Get a single post by ID
- `POST /api/posts` — Create a post (requires auth, supports image upload)
- `PUT /api/posts/:id` — Update a post (requires auth)
- `DELETE /api/posts/:id` — Delete a post (requires auth)
- `GET /api/posts/:id/comments` — Get comments for a post
- `POST /api/posts/:id/comments` — Add a comment (requires auth)

### Categories

- `GET /api/categories` — Get all categories
- `POST /api/categories` — Create a new category (requires auth)

### Example Post Object

```json
{
  "_id": "123...",
  "title": "My Post",
  "content": "Hello world",
  "category": { "_id": "catid...", "name": "Tech" },
  "author": { "_id": "userid...", "username": "alice" },
  "featuredImage": "/uploads/filename.jpg",
  "isPublished": true,
  "comments": [
    { "user": { "_id": "userid...", "username": "bob" }, "text": "Nice post!" }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## Features Implemented

- User registration and login (JWT authentication)
- Protected routes for creating/editing/deleting posts
- Create, read, update, delete (CRUD) blog posts
- Image upload for featured images
- Category management and filtering
- Search posts by keyword
- Pagination for post list
- Commenting system for posts
- Responsive UI with React and React Router
- Optimistic UI updates and error handling

---

## Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Post List

![Post List](screenshots/posts.png)

### Post Detail with Comments

![Post Detail](screenshots/post-detail.png)

### Create/Edit Post

![Create Post](screenshots/create-post.png)

### Login/Register

![Login](screenshots/login.png)

---

## License

MIT

---

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

---

## Authorship

Developed by Kamunge
GitHub: [https://github.com/KamungeD](https://github.com/KamungeD)
