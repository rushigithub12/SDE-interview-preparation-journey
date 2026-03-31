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
    if (time > 0) setIsRunning(true); //time 10 start
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
      <header>CountDown timer</header>
      <div>
        <p>{time} secs</p>
        <button onClick={handleStart}>start</button>
        <button onClick={handlePause}> pause</button>
        <button onClick={handleReset}>reset</button>
      </div>
    </div>
  );
};

export default CountDownTimer;
