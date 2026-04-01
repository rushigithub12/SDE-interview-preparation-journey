import React from "react";
import { useSessionStorage } from "../customHooks/useSessionStorage";

// Listen to storage events across tabs
// window.addEventListener('storage', (event) => {
//     if (event.key === 'syncData') {
//         console.log('Data synchronized across tabs:', event.newValue);
//     }
// });

// Update Local Storage data
// function updateData(newValue) {
//     localStorage.setItem('syncData', newValue);
// }

// Usage: Update the data
// updateData('New data to sync');

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
