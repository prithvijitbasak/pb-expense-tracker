import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { API } from "../utils/auth";
import "../assets/styles/UpdateExpenseModal.css";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { formatDtConven, toInputDateFormat } from "../utils/formatterFunctions";
// Make sure styles exist

const UpdateExpenseModal = ({ expenseData, onClose, onUpdated }) => {
  const [categories, setCategories] = useState([]);
  const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  const dropdownRef = useRef(null);



  // Load initial data when modal opens
  useEffect(() => {
    if (expenseData) {
      const formattedISO = toInputDateFormat(expenseData.date); // instead of toISOString

      setFormData({
        _id: expenseData._id || "",
        title: expenseData.title || "",
        amount: expenseData.amount || "",
        category: expenseData.category || "",
        date: formattedISO, // <-- fix here
        notes: expenseData.notes || "",
      });
    }
  }, [expenseData]);

  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API}/api/expenses/categories`);
        const data = await response.json();
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenCategoryDropdown(false);
      }
    };

    if (openCategoryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCategoryDropdown]);

  // Update form state
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "amount" ? Number(value) : value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // Format the date to "dd-mm-yyyy"
    const isoDate = new Date(formData.date);
    const formattedDate = formatDtConven(isoDate);

    // Prepare payload
    const payload = {
      ...formData,
      date: formattedDate, // Replace ISO with formatted date
    };

    try {
      const response = await fetch(`${API}/api/expenses/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Expense updated successfully.");
        onUpdated();
        onClose();
      } else {
        toast.error(result.message || "Failed to update expense.");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="update-modal-wrapper flex inset-0 items-center justify-center bg-[rgba(0,0,0,0.7)] w-full h-screen fixed top-0 pointer-events-none">
      <div className="update-modal-container w-[35%] pointer-events-auto">
        <div className="update-modal-contents bg-white rounded-lg p-4">
          <div className="close-btn-div flex justify-end">
            <span
              className="close-btn bg-red-500 px-3 py-1 rounded-md cursor-pointer flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                onClose();
              }}
            >
              <RxCross1 />
            </span>
          </div>
          <h2 className="modal-heading font-bold text-center text-3xl">
            Edit Expense
          </h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              required
            />
            <input
              type="date"
              required
              className="input-field"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
            <textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="form-textarea w-full"
            />

            <div className="category-field w-full!" ref={dropdownRef}>
              <input
                type="text"
                value={formData.category}
                placeholder="Select Category"
                readOnly
                onClick={() => setOpenCategoryDropdown((prev) => !prev)}
                required
              />
              {openCategoryDropdown && (
                <div className="category-dropdown">
                  {categories.map((category, idx) => (
                    <p
                      key={idx}
                      className="category-dropdown-items"
                      onClick={() => {
                        handleChange("category", category);
                        setOpenCategoryDropdown(false);
                      }}
                    >
                      {category}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-actions text-center">
              <button
                type="submit"
                className="update-btn bg-[var(--top-color)] cursor-pointer border-[2px] border-[var(--top-color)] rounded-lg text-white hover:bg-white hover:text-[var(--top-color)]"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

UpdateExpenseModal.propTypes = {
  expenseData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdated: PropTypes.func.isRequired,
};

export default UpdateExpenseModal;
