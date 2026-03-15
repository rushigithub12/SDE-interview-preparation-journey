import React, { useEffect, useRef, useState } from "react";
import AutoCompleteList from "./AutoCompleteList";
import { getRecipe } from "../api/getRecipe";
import { useDebounce } from "../hooks/useDebounce";
import { useCache } from "../hooks/useCache";

const AutoCompleteWrapper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const [userInput, setUserInput] = useState("");

  const { debouncedVal } = useDebounce(userInput, 1500);

  const { set, get, has, clear } = useCache();
  const inputRef = useRef();

  useEffect(() => {
    const fetchRecipe = async (query) => {
      if (has(query)) {
        let tempData = get(query);
        setRecipeList(tempData);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const resp = await getRecipe(query);
        set(query, resp.recipes.slice(0, 10));
        setRecipeList(resp.recipes.slice(0, 10));
      } catch (err) {
        console.log(err);
        setRecipeList([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (debouncedVal.length > 0) {
      fetchRecipe(debouncedVal);
    } else {
      setRecipeList([]);
      setIsLoading(false);
    }
  }, [debouncedVal]);

  const handleKeyDown = (e) => {
    if (recipeList.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < recipeList.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? recipeList.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      setUserInput(recipeList[activeIndex].name);
      setRecipeList([]);
    }
  };

  return (
    <div className="autocomplete-wrapper" onKeyDown={handleKeyDown}>
      <input
        type="text"
        value={userInput}
        ref={inputRef}
        onChange={(e) => setUserInput(e.target.value)}
        autoFocus={true}
        className="autocomplete-input"
      />
      <AutoCompleteList
        isLoading={isLoading}
        recipeList={recipeList}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
    </div>
  );
};

export default AutoCompleteWrapper;
