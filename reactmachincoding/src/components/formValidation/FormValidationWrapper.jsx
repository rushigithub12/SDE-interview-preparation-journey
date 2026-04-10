import React, { useState } from "react";
import InputComponent from "./InputComponent";

const FormValidationWrapper = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
  });

  const handleChange = (e, type) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [type]: value }));
  };

  const isValidInput = (name, value) => {
    const errorObj = { firstName: "", lastName: "", mobileNumber: "" };
    if ((formData.firstName.length < 5)) {
      errorObj.firstName = "Enter Correct Firstname";
    } else {
      errorObj.firstName = "";
    }

    if (formData.lastName.length < 2) {
      errorObj.lastName = "Enter valid lastName";
    } else {
      errorObj.lastName = "";
    }

    if (formData.mobileNumber.length !== 10 || isNaN(formData.mobileNumber)) {
      errorObj.mobileNumber = "Enter valida 10-digit numbers";
    } else {
      errorObj.mobileNumber = "";
    }

    setErrors(errorObj);

    return !Object.values(errorObj).some((error) => error !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = isValidInput();
    if (isValid) {
      console.log(formData);
    } else {
      console.error("not valid input");
    }
  };

  return (
    <div>
      <h3>Form Validation</h3>
      <form action="" onSubmit={handleSubmit}>
        <InputComponent
          type="text"
          name="firstName"
          label="First Name"
          onChange={(e) => handleChange(e, "firstName")}
          value={formData.firstName}
          error={errors.firstName}
        />
        <InputComponent
          type="text"
          name="lastName"
          label="Last Name"
          onChange={(e) => handleChange(e, "lastName")}
          value={formData.lastName}
          error={errors.lastName}
        />
        <InputComponent
          type="number"
          name="mobileNumber"
          label="Mobile Number"
          onChange={(e) => handleChange(e, "mobileNumber")}
          value={formData.mobileNumber}
          error={errors.mobileNumber}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormValidationWrapper;
