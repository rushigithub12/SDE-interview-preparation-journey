import React, { useEffect, useState } from "react";

const LocalStorageDemo = () => {
  const [formData, setFormData] = useState(() => {
    try {
      const savedData = localStorage.getItem("jobApplication");

      if (!savedData || savedData === "undefined") {
        return { userName: "", userEmail: "" };
      }

      return JSON.parse(savedData);
    } catch (error) {
      console.error("Invalid JSON in localStorage:", error);
      return { userName: "", userEmail: "" };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("jobApplication", JSON.stringify(formData));
    } catch (e) {
      console.error(e.toString());
    }
  }, [formData]);

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
