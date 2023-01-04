import { useEffect, useState } from 'react';
import axios from 'axios';

export interface CommentListProps {
  post: {
    id: string;
    title: string;
    comments?: {id: string; content: string;}[]
  }
}

export const CommentList = ({post}: CommentListProps) => {
  if(!post.comments) {
    return null;
  }

  const renderedComments = post.comments.map((comment: any) => comment.status === 'approved' ? <li key={comment.id}>{comment.content}</li> : <li key={comment.id}>{comment.status}</li>);
  return <ul>{renderedComments}</ul>;
}
