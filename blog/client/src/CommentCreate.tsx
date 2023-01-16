import { ChangeEvent, useState } from 'react';
import axios from 'axios';

export interface CommentCreateProps {
  post: {
    id: string;
    title: string;
  }
}

export const CommentCreate = ({post}: CommentCreateProps) => {
  const [content, setContent] = useState( "" );
  const onSubmit = async (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const res = await axios.post(`http://posts.com/posts/${post.id}/comments`, {content});
    console.log(res);
    setContent("");
  }
  return <div>
    <form action="" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="">New Comment</label>
        <input type="text" value={content} onChange={(e) => setContent(e.target.value)} className="form-control"/>
      </div>
      <button className="btn btn-primary">Submit</button>
    </form>
  </div>
}
