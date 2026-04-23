import React from "react";
import './Card.css';

const Card = ({ name, phone, email, address, company }) => {
  return (
    <div className="job-board-user-card">
      <div className="job-board-description">Name: {name}</div>
      <div className="job-board-description">Phone: {phone}</div>
      <div className="job-board-description">Email: {email}</div>
      <div className="job-board-description">Address{`${address}`}</div>
      <div className="job-board-description">Company: {company}</div>
    </div>
  );
};

export default Card;
