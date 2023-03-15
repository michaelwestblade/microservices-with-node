import { FormEvent, useState } from 'react';
import axios from 'axios';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const signup = () => {
  const [email, setEmail] = useState( '' );
  const [password, setPassword] = useState( '' );
  const { doRequest, loading, errors } = useRequest({
    url:'/api/users/signup',
    body: {email, password},
    method: 'post',
    onSuccess: () => Router.push('/')
  })
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await doRequest();
  }

  return <form action="" onSubmit={handleSubmit}>
    <h1>Sign Up</h1>
    <div className="form-group">
      <label htmlFor="">Email address</label>
      <input type="text" className="form-control" value={email} onChange={e => setEmail(e.target.value)}/>
    </div>
    <div className="form-group">
      <label htmlFor="">Password</label>
      <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)}/>
    </div>
    {errors && errors.length && <div className="alert alert-danger">
      <h4>Oops</h4>
      <ul className="my-0">
        {errors.map(error => <li key={error.message}>{error.message}</li>)}
      </ul>
    </div>}
    <button className="btn btn-primary">Sign Up</button>
  </form>
}

export default signup;
