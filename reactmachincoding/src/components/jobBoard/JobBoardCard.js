import React, { useEffect, useState } from "react";
import Card from "./Card";

const JobBoardCard = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const resp = await fetch("https://jsonplaceholder.typicode.com/users");
      const jsonData = await resp.json();

      setCandidates(jsonData);
    };

    fetchUserData();
  }, []);

  console.log(candidates);

  return (
    <div>
      <h3>JobBoardCard</h3>
      {candidates && candidates.length ? (
        candidates.map((item) => (
          <Card
            key={item.id}
            name={item.name}
            phone={item.phone}
            email={item.email}
            address={`${item.address.street}, ${item.address.city}, ${item.address.zipcode}`} 
            company={item.company.name}
          />
        ))
      ) : (
        <div>Data is not there</div>
      )}
    </div>
  );
};

export default JobBoardCard;
