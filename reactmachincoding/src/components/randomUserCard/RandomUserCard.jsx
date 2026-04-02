import React from "react";
import { useFetch } from "../customHooks/useFetch";
import "./RandomUserCard.css";

const RandomUserCard = () => {
  const { data, isLoading } = useFetch("https://randomuser.me/api/?results=5");

  return (
    <div className="random-user-card">
      <header>RandomUserCard</header>
      {isLoading ? (
        "Loading...."
      ) : (
        <>
          {data?.map((item, ind) => (
            <div key={item.login.uuid} className="user-card">
              <div className="left-side">
                <img src={item.picture.large} alt="" />
              </div>
              <div className="right-side">
                <div className="description">{`Name: ${item.name.title}. ${item.name.first} ${item.name.last}`}</div>
                <div className="description">{`Phone: ${item.phone}`}</div>
                <div className="description">{`Email: ${item.email}`}</div>
                <div className="description">{`Address: ${item.location.timezone.description}`}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default RandomUserCard;
