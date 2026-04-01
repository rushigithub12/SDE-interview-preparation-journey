import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchFunction = async () => {
      const response = await fetch(url);
      const responseData = await response.json();
      setData(responseData.results);
      setIsLoading(false);
    };
    fetchFunction();
  }, []);

  return { data, isLoading };
};
