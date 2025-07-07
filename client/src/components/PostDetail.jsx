import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import api, { postService } from "../services/api";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [fetchPost, { loading, error }] = useApi(api.getPost);
  const [deletePost, { loading: deleting, error: deleteError }] = useApi(api.deletePost);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchPost(id).then(setPost).catch(() => {});
  }, [id]);

  // Fetch comments when post loads or id changes
  useEffect(() => {
    postService.getComments(id).then(setComments);
  }, [id]);

  // Add comment handler
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const newComment = await postService.addComment(id, { text: commentText });
      setComments([...comments, newComment]);
      setCommentText("");
    } finally {
      setCommentLoading(false);
    }
  };

  // Optimistic delete: navigate away immediately, show error if fails
  const handleDelete = async () => {
    if (window.confirm("Delete this post?")) {
      navigate("/"); // Optimistically navigate away
      try {
        await deletePost(id);
      } catch {
        alert("Failed to delete post. Please refresh the page.");
      }
    }
  };

  if (loading) return <div>Loading post...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!post) return null;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>
        <b>By:</b> {post.author?.username} | <b>Category:</b> {post.category?.name}
      </p>
      {post.featuredImage && (
        <img src={post.featuredImage} alt="Featured" style={{ maxWidth: 300 }} />
      )}
      <p>{post.content}</p>
      <Link to={`/posts/${id}/edit`}>Edit</Link>
      {" | "}
      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? "Deleting..." : "Delete"}
      </button>
      {deleteError && <div style={{ color: "red" }}>{deleteError}</div>}
      <br />
      <Link to="/">Back to list</Link>

      <h3>Comments</h3>
      <ul>
        {comments.map((c, i) => (
          <li key={i}>
            <b>{c.user?.username || "User"}:</b> {c.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddComment}>
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit" disabled={commentLoading}>
          {commentLoading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}