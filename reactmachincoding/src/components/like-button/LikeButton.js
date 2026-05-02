import React, { useState } from "react";
import { HeartIcon, SpinnerIcon } from "./icons";
import "./LikeButton.css";

const URL = "https://jsonplaceholder.typicode.com/posts";

const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("'");

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const resp = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: liked ? "like" : "unlike",
        }),
      });

      if (resp.status >= 200 && resp.status < 300) {
        setLiked(!liked);
        setIsLoading(false);
      }

      console.log(resp);
    } catch (err) {
      setErr(err.toString());
    } finally {
      setIsLoading(false);
      setErr("");
    }
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className={`likeBtn ${liked ? "liked" : ""}`}
      >
        {isLoading ? <SpinnerIcon className={`likeBtn-icon`}/> : <HeartIcon  className={`likeBtn-icon`}/>}
        {liked ? "Liked" : "Like"}
      </button>
      {err && <span className="error" >{err}</span>}
    </div>
  );
};

export default LikeButton;
