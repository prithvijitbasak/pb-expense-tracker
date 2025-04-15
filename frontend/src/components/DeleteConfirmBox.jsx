import PropTypes from "prop-types";
import { API } from "../utils/auth";
import { toast } from "react-toastify";
import "../assets/styles/DeleteConfirmBox.css";

const DeleteConfirmBox = ({ expenseData, onClose, onDeleted }) => {
  const handleDelete = async () => {
    console.log("clicked delete");
    const token = localStorage.getItem("token");
    const expenseId = expenseData._id;
    try {
      await fetch(`${API}/api/expenses/${expenseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Expense deleted successfully!");
      onDeleted();
      onClose();
    } catch (error) {
      console.log("There is a error in deleting: ", error);
      toast.error("Unable to delete the expense!");
    }
  };

  return (
    <>
      <div className="flex justify-center items-center bg-[rgba(0,0,0,0.7)] w-full h-screen fixed top-0 pointer-events-none">
        <div className="delete-box bg-white w-[35%] pointer-events-auto rounded-lg p-4!">
          <h3 className="font-bold text-xl text-center pb-1.5!">
            Heads Up! Are you sure you want to delete?
          </h3>
          <p className="text-center mb-4!">
            After deleting{" "}
            <span className="text-[var(--top-color)] font-bold">
              {expenseData.title}
              {`'s `}
            </span>{" "}
            expense you will not be able to recover the it!
          </p>
          <div className="flex justify-end gap-5">
            <button
              className="rounded bg-green-500 px-2 font-medium cursor-pointer edit-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                onClose();
              }}
            >
              No
            </button>
            <button
              className="rounded bg-red-500 px-3 py-3 font-medium cursor-pointer delete-btn"
              onClick={() => handleDelete()}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

DeleteConfirmBox.propTypes = {
  expenseData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onDeleted: PropTypes.func.isRequired,
};

export default DeleteConfirmBox;
