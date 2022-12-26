import { useEffect, useState } from 'react';
import axios from 'axios';

export interface CommentListProps {
  post: {
    id: string;
    title: string;
  }
}

export const CommentList = ({post}: CommentListProps) => {
  const [comments, setComments] = useState( [] );
  useEffect(() => {
    const getComments = async () => {
      const res = await axios.get(`http://localhost:4001/posts/${post.id}/comments`);
      setComments(res.data);
    }
    getComments();
  }, []);

  const renderedComments = comments.map((comment: any) => <li key={comment.id}>{comment.content}</li>);
  return <ul>{renderedComments}</ul>;
}
