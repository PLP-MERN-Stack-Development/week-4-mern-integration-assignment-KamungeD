import PostDetail from "../components/PostDetail";
import { useParams } from "react-router-dom";

export default function PostDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <PostDetail id={id} />
    </div>
  );
}