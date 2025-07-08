import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import { postService } from "../services/api";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [fetchPosts, { loading, error }] = useApi(
    async (pageNum = 1, searchVal = "", categoryVal = "") => {
      const res = await postService.getAllPosts(pageNum, 5, searchVal, categoryVal);
      setPages(res.pages || 1);
      return res.posts || [];
    }
  );
  const [deletePost, { loading: deleting, error: deleteError }] = useApi(postService.deletePost);

  // Fetch categories for filter dropdown
  useEffect(() => {
    postService.getCategories().then(res => setCategories(res.data || res));
  }, []);

  // Fetch posts when page, search, or category changes
  useEffect(() => {
    fetchPosts(page, search, category).then(setPosts).catch(() => {});
  }, [page, search, category]);

  const handleSearchChange = e => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = e => {
    setCategory(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  // Optimistic delete handler
  const handleDelete = async (id) => {
    const oldPosts = posts;
    setPosts(posts.filter(post => post._id !== id)); // Remove from UI immediately
    try {
      await deletePost(id);
    } catch {
      setPosts(oldPosts); // Revert if server fails
      alert("Failed to delete post.");
    }
  };

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Blog Posts</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={handleSearchChange}
          style={{ marginRight: 8 }}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <Link to={`/posts/${post._id}`}>{post.title}</Link> by{" "}
            {post.author?.username}
            {" "}
            <button onClick={() => handleDelete(post._id)} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <div>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              disabled={page === i + 1}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      {deleteError && <div style={{ color: "red" }}>{deleteError}</div>}
    </div>
  );
}