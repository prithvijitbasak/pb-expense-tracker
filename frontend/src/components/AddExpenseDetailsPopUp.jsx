import { useState } from "react";

const AddExpenseDetailsPopUp = () => {
  // Initialize state to keep track of the input fields
  const [inputFields, setInputFields] = useState([{ id: 1 }]);

  // Function to add new input fields
  const addInputFields = () => {
    setInputFields([...inputFields, { id: inputFields.length + 1 }]);
  };

  const deleteInputFields = (id) => {
    if (inputFields.length > 1) {
      setInputFields(inputFields.filter((field) => field.id !== id));
    }
  };

  return (
    <>
      <div className="popup-wrapper">
        <div className="popup-card">
        <div className="popup-card-top">
          <button className="popup-card-add-more-btn" onClick={addInputFields}>Add More</button>
        </div>
          {inputFields.map((field) => (
            <div className="input-field" key={field.id}>
              <input type="text" placeholder="Item name" required />
              <input type="number" placeholder="Amount spent" required />
              <input
                type="text"
                placeholder="Describe your expenditure..."
                required
              />
              <div
                className="delete-expense-icon"
                onClick={() => deleteInputFields(field.id)}
              >
                <img src="/images/icons8-minus-48.png" alt="Remove Item Icon" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddExpenseDetailsPopUp;
