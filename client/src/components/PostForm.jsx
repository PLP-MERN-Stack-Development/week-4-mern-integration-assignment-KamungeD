import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import api from "../services/api";

export default function PostForm({ editMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [fetchCategories] = useApi(api.getCategories);
  const [fetchPost] = useApi(api.getPost);
  const [savePost, { loading, error }] = useApi(editMode ? api.updatePost : api.createPost);

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
        <label>Title:</label>
        <input name="title" value={form.title} onChange={handleChange} required />
      </div>
      <div>
        <label>Content:</label>
        <textarea name="content" value={form.content} onChange={handleChange} required />
      </div>
      <div>
        <label>Category:</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select...</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Featured Image:</label>
        <input type="file" name="featuredImage" accept="image/*" onChange={handleChange} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : editMode ? "Update" : "Create"}
      </button>
    </form>
  );
}