import React, { useEffect } from "react";
import "./AutoComplete.css"

const AutoCompleteList = ({
  isLoading,
  recipeList,
  activeIndex,
  setActiveIndex
}) => {
  return (
    <div>
      {isLoading ? (
        ".....loading"
      ) : (
        <div  className='recipe-list'>
          {recipeList?.map((data, ind) => (
            <div
              key={data.id}
              style={{
                border: `${activeIndex === ind ? "1px solid blue" : "1px solid whitesmoke"}`,
                borderRadius: "5px",
                padding: "2px",
                cursor: 'pointer'
              }}
              onClick={() => setActiveIndex(ind)}  
            >
              {data.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoCompleteList;
