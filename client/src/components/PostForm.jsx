import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { postService, categoryService } from "../services/api"; // <-- use postService

export default function PostForm({ editMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [fetchCategories] = useApi(() => categoryService.getAllCategories());
  const [fetchPost] = useApi((id) => postService.getPost(id));
  const [savePost, { loading, error }] = useApi(
    editMode
      ? (id, data) => postService.updatePost(id, data)
      : (data) => postService.createPost(data)
  );

  const [form, setForm] = useState({
    title: "",
    content: "",
    category: "",
    featuredImage: null,
  });

  // Load categories and, if editing, the post
  useEffect(() => {
    fetchCategories().then(setCategories);
    if (editMode && id) {
      fetchPost(id).then((data) =>
        setForm({
          title: data.title,
          content: data.content,
          category: data.category?._id,
          featuredImage: null,
        })
      );
    }
  }, [id, editMode]);

  // Basic form validation
  const [formError, setFormError] = useState("");
  const validate = () => {
    if (!form.title || !form.content || !form.category) {
      setFormError("All fields are required.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("category", form.category);
    if (form.featuredImage) formData.append("featuredImage", form.featuredImage);
    formData.append("isPublished", "true");

    try {
      if (editMode) {
        await savePost(id, formData);
      } else {
        await savePost(formData);
      }
      navigate("/");
    } catch {}
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{editMode ? "Edit" : "Create"} Post</h2>
      {formError && <div style={{ color: "red" }}>{formError}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        <label htmlFor="title">Title:</label>
        <input id="title" name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea id="content" name="content" value={form.content} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select id="category" name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select...</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="featuredImage">Featured Image:</label>
        <input id="featuredImage" type="file" name="featuredImage" accept="image/*" onChange={handleChange} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : editMode ? "Update" : "Create"}
      </button>
    </form>
  );
}