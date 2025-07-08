import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <h1>Welcome to the MERN Blog!</h1>
      <p>
        <Link to="/posts/new">Create a New Post</Link>
      </p>
      <p>
        <Link to="/posts">View All Posts</Link>
      </p>
    </div>
  );
}