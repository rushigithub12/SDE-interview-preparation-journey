import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSessionStorage } from "../hooks/useSessionStorage";

const LocalStorageDemo = () => {
  const [formData, setFormData] = useSessionStorage("jobApplication", {
    userName: "",
    userEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("formData", formData);
    localStorage.removeItem("jobApplication");
    setFormData({ userName: "", userEmail: "" });
  };

  return (
    <div>
      <header>LocalStorage Demo</header>
      <div>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="userEmail"
          value={formData.userEmail}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default LocalStorageDemo;
