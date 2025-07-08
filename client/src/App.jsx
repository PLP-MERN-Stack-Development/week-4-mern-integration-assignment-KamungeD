import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import PostNew from "./pages/PostNew";
import PostEdit from "./pages/PostEdit";
import PostDetailPage from "./pages/PostDetailPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <nav style={{ padding: 16, borderBottom: "1px solid #ccc" }}>
        <Link to="/">Home</Link> | <Link to="/posts/new">New Post</Link> | <Link to="/profile">Profile</Link> | <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/new" element={
          <ProtectedRoute>
            <PostNew />
          </ProtectedRoute>
        } />
        <Route path="/posts/:id/edit" element={
          <ProtectedRoute>
            <PostEdit />
          </ProtectedRoute>
        } />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </Router>
  );
}

export default App;
