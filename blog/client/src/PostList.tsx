import { useEffect, useState } from 'react';
import axios from 'axios';
import { CommentCreate } from './CommentCreate';
import { CommentList } from './CommentList';

export const PostList = () => {
  const [posts, setPosts] = useState( {} );
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('http://localhost:4000/posts');
      setPosts(res.data);
    }
    fetchPosts();
  }, []);

  const renderedPosts = Object.values(posts);
  return <div className="d-flex flex-row flex-wrap justify-content-between">
    {renderedPosts.map((post: any) => <div key={post.id} className="card" style={{width: '30%', marginBottom: '20px'}}>
      <div className="card-body">
        <h3>{post.title}</h3>
        <hr/>
        <CommentList post={post}/>
        <CommentCreate post={post}/>
      </div>
    </div>)}
  </div>
}
