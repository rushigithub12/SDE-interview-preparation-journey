import { useEffect, useState } from "react";

export const useSessionStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(
        sessionStorage.getItem(key) || String(defaultValue),
      );
    } catch (e) {
      console.error(e);
      currentValue = defaultValue;
    }
    return currentValue;
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
