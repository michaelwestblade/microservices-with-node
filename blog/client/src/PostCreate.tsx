import React, { ChangeEvent, useState } from 'react';
import axios from 'axios';

export const PostCreate = () => {
  const [title, setTitle] = useState( '' );

  const onSubmit = async (evt: ChangeEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const res = await axios.post('http://localhost:4000/posts', {
      title
    });

    console.log(res);
    setTitle('');
  }

  return <div>
    <form action="" onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title</label>
        <input value={title} onChange={e => setTitle(e.target.value)} type="text" className="form-control"/>
      </div>
      <button className="btn btn-primary">Submit</button>
    </form>
  </div>
}
