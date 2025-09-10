import { useEffect, useState } from "react";
import "../assets/styles/AddExpense.css";
import { toast } from "react-toastify";
import { API } from "../utils/auth";

const AddExpense = () => {
  const [inputFields, setInputFields] = useState([
    { id: 1, title: "", amount: "", category: "", date: "", note: "" },
  ]);

  const [categories, setCategories] = useState([]);

  // const [isCategoryClicked, setIsCategoryClicked] = useState(false);

  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(null);

  // Function to handle input changes
  const handleChange = (id, field, value) => {
    setInputFields((prevFields) =>
      prevFields.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Function to add new input fields
  const addInputFields = () => {
    setInputFields([
      ...inputFields,
      {
        id: inputFields.length + 1,
        title: "",
        amount: "",
        category: "",
        date: "",
        note: "",
      },
    ]);
  };

  // Function to delete input fields
  const deleteInputFields = (id) => {
    if (inputFields.length > 1) {
      setInputFields(inputFields.filter((field) => field.id !== id));
    }
  };

  // Function to submit data
  const handleSubmit = async () => {
    const token = localStorage.getItem("token"); // Retrieve JWT token

    if (!token) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    // Transform inputFields to match backend structure
    const expenses = inputFields.map((field) => {
      // Convert "YYYY-MM-DD" to "DD-MM-YYYY"
      const [year, month, day] = field.date.split("-");
      const formattedDate = `${day}-${month}-${year}`;

      return {
        title: field.title.trim(),
        amount: parseFloat(field.amount),
        category: field.category.trim(),
        date: formattedDate, // Use formatted date
        notes: field.note.trim(),
      };
    });

    try {
      const response = await fetch(`${API}/api/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenses), // Send only one expense if backend expects object
      });

      const data = await response.json();
      console.log("Backend Response:", data); // Log response for debugging

      if (response.ok) {
        toast.success("Expenses added successfully!");
        setInputFields([
          { id: 1, title: "", amount: "", category: "", date: "", note: "" },
        ]);
      } else {
        toast.error(`Some expenses failed: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong!");
    }
  };

  const handleCategoryClick = (id) => {
    setOpenCategoryDropdown((prevId) => (prevId === id ? null : id)); // Toggle dropdown
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API}/api/expenses/categories`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // console.log("Fetched Categories from API:", data); // Debugging API response

        // Extract the categories array from the object
        if (Array.isArray(data.categories)) {
          setCategories(data.categories); // ✅ Correct way
        } else {
          console.error("API returned unexpected format:", data);
          setCategories([]); // Prevents issues
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Prevents app crash
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="popup-wrapper">
      <div className="popup-card">
        <div className="popup-card-top">
          <button className="popup-card-add-more-btn" onClick={addInputFields}>
            Add More
          </button>
        </div>
        {inputFields.map((field) => (
          <div className="input-field-div" key={field.id}>
            <input
              type="text"
              placeholder="Title"
              required
              className="input-field"
              value={field.title}
              onChange={(e) => handleChange(field.id, "title", e.target.value)}
            />
            <input
              type="number"
              placeholder="Amount spent"
              required
              className="input-field"
              value={field.amount}
              onChange={(e) => handleChange(field.id, "amount", e.target.value)}
            />

            <div className="category-field">
              <input
                type="text"
                placeholder="Select Category"
                required
                className="input-field"
                value={field.category}
                readOnly
                onClick={() => handleCategoryClick(field.id)} // Toggle dropdown on click
              />
              {openCategoryDropdown === field.id && ( // Show dropdown only for the clicked row
                <div className="category-dropdown">
                  {categories.length > 0 ? (
                    categories.map((value, index) => (
                      <p
                        key={index}
                        className="category-dropdown-items"
                        onClick={() => {
                          handleChange(field.id, "category", value);
                          setOpenCategoryDropdown(null); // Close dropdown after selection
                        }}
                      >
                        {value}
                      </p>
                    ))
                  ) : (
                    <p>Loading categories...</p>
                  )}
                </div>
              )}
            </div>

            <input
              type="date"
              required
              className="input-field"
              value={field.date}
              onChange={(e) => handleChange(field.id, "date", e.target.value)}
            />
            <textarea
              placeholder="Describe your expenditure..."
              className="input-field note-area"
              value={field.note}
              onChange={(e) => handleChange(field.id, "note", e.target.value)}
            />
            <div
              className="delete-expense-icon"
              onClick={() => deleteInputFields(field.id)}
            >
              <img src="/images/icons8-minus-48.png" alt="Remove Item Icon" />
            </div>
          </div>
        ))}
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddExpense;
