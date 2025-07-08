import PostForm from "../components/PostForm";
import { useParams } from "react-router-dom";

export default function PostEdit() {
  const { id } = useParams();
  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm editMode id={id} />
    </div>
  );
}