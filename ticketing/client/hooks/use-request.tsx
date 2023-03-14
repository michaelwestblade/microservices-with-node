import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body }) => {
  const [errors, setErrors] = useState( null );
  const [loading, setLoading] = useState( false );

  const doRequest = async () => {
    try {
      setErrors(null)
      const response = await axios[method](url, body);
      return response.data;
    } catch ( error ) {
      setErrors(error.response.data.errors);
    }
  };

  return {
    errors,
    doRequest,
    loading
  }
}
