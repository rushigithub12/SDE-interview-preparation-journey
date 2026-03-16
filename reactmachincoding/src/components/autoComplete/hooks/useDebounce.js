import { useEffect, useState } from "react";

export const useDebounce = (userInput, delay) => {
  const [debouncedVal, setDebouncedVal] = useState("");

  useEffect(() => {
    let inputInterval;

    if (inputInterval) clearTimeout(inputInterval);

    inputInterval = setTimeout(async () => {
      setDebouncedVal(userInput);
    }, delay);

    return () => {
      clearTimeout(inputInterval);
    };
  }, [userInput]);

  return {
    debouncedVal,
  };
};
