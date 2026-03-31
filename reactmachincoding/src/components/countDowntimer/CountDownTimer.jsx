import React, { useEffect, useRef, useState } from "react";

const CountDownTimer = () => {
  const [time, setTime] = useState(10);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (time < 0) {
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isRunning]);

  const handleStart = () => {
    if (time > 0) setIsRunning(true);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(10);
  };

  return (
    <div>
      <header>CountTimer</header>
      <div>
        <span>{time}secs</span>
        <div>
          <button onClick={handleStart}>Start</button>
          <button onClick={handlePause}>Pause</button>
          <button onClick={handleReset}>Reset</button>
        </div>
      </div>
    </div>
  );
};

export default CountDownTimer;
