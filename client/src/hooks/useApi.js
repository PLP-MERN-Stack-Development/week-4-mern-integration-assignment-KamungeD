import { useState } from "react";
import api from "../services/api";

// Generic API hook for GET/POST/PUT/DELETE
export default function useApi(requestFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestFn(...args);
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
      throw err;
    }
  };

  return [callApi, { loading, error }];
}