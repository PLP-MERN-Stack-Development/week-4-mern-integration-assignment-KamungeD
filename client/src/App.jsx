import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import PostList from "./components/PostList";
import PostDetail from "./components/PostDetail";
import PostForm from "./components/PostForm";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <nav style={{ padding: 16, borderBottom: "1px solid #ccc" }}>
        <Link to="/">Home</Link> | <Link to="/posts/new">New Post</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/new" element={
          <ProtectedRoute>
            <PostForm />
          </ProtectedRoute>
        } />
        <Route path="/posts/:id/edit" element={
          <ProtectedRoute>
            <PostForm editMode />
          </ProtectedRoute>
        } />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
};

export default App;
