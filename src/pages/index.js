import { useState } from "react";
import Axios from "axios";
import dbConnect from "../../lib/mogodb.connection";

export async function getStaticProps() {
  const schema = require("../../models/Schema");
  // defined this connection for calling data
  await dbConnect();
  const todos = await schema.find().sort({ createdAt: "desc" });
  console.log(todos);
  return {
    props: {
      todos: JSON.parse(JSON.stringify(todos)),
    },
  };
}

export default function Home({ todos }) {
  const [iscomplete, setisComplete] = useState(false);
  const [isEmptyError, setIsEmptyError] = useState(false);
  const [todo, setTodo] = useState("");
  // this error for adding section
  const [error, setError] = useState("");
  // this error for editing section
  const [errorupdate, setErrorupdate] = useState("");
  // this bellow state is for handling update
  const [selectedTodoId, setSelectedTodoId] = useState("");
  // model state
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const todoObj = {
      isCompleted: iscomplete, // Use iscomplete value if truthy, otherwise default to false
      todo: todo,
    };
    console.log(todoObj);

    // Check if todo field is empty
    if (!todo) {
      setIsEmptyError(true);
      return;
    }

    // Post method
    Axios.post("/api/todo", todoObj)
      .then(() => {
        window.location.window(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 409) {
          setError("Todo already exists");
        } else {
          window.location.href = window.location.href;
        }
      });
  };

  // Delete method
  const handleDelete = (id) => {
    Axios.delete(`/api/todo?id=${id}`).then(() => {
      window.location.reload(false);
    });
  };

  // Update method
  const handleUpdate = async (id) => {
    const todoObj = {
      isCompleted: iscomplete,
      todo: todo,
    };
    console.log(todoObj);
    console.log(id);
    await Axios.put(`/api/todo?id=${id}`, todoObj)
      .then(() => {
        window.location.reload(false);
      })
      .catch((err) => {
        setErrorupdate("Error updating todo is already exist");
        console.log(err);
      });
  };

  const handleEditform = (isCompleted, todo, id) => {
    setSelectedTodoId(id);
    setisComplete(Boolean(isCompleted));
    setTodo(todo);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 ">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col w-80">
          <label className="text-gray-900 text-3xl">Iscomplete</label>
          <input
            type="checkbox"
            onChange={(e) => setisComplete(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
            placeholder="Title"
          />
          {isEmptyError && (
            <p className="text-red-500 font-bold">Text must not be empty</p>
          )}
        </div>
        <div className="flex flex-col w-80">
          <label className="text-gray-900 text-3xl">Text</label>
          <input
            onChange={(e) => setTodo(e.target.value)}
            placeholder="Your Todo"
            className="bg-gray-300 rounded-md w-full px-3 py-3 outline-none focus:outline-blue-400"
          />
        </div>
        <button
          type="submit"
          className="mt-3 px-3 py-3 bg-blue-400 hover:bg-blue-600 rounded-md"
        >
          Add
        </button>
      </form>
      {/* Table */}
      <div>
        <table className="w-full text-sm text-left ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-12 py-3">Iscomplete</th>
              <th className="px-12 py-3">Content</th>
              <th className="px-24 py-3">Action</th>
            </tr>
          </thead>
          {todos.map((item) => (
            <tbody key={item._id}>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th className="px-12 py-4 font-medium text-gray-900">
                  {item.isCompleted ? "Completed" : "Not Completed"}
                </th>
                {isEmptyError && (
                  <p className="text-red-500 font-bold">
                    Text must not be empty
                  </p>
                )}
                <td className="px-12 py-4">{item.todo}</td>
                <td className="px-12 py-4">
                  <button
                    onClick={() =>
                      handleEditform(item.isCompleted, item.todo, item._id)
                    }
                    className="bg-green-400 rounded-sm px-3 py-1 hover:bg-green-700 hover:text-gray-100"
                  >
                    {" "}
                    Edit{" "}
                  </button>{" "}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-400 rounded-sm px-3 py-1 hover:bg-red-700 hover:text-gray-100"
                  >
                    {" "}
                    Delete{" "}
                  </button>
                </td>
              </tr>
            </tbody>
          ))}
        </table>
        {/* form Modal for edit feartures */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-overlay bg-gray-800 opacity-50 absolute inset-0"></div>
            <div className="modal-content bg-white rounded-lg p-8 z-10">
              <form>
                <div className="flex flex-col w-80">
                  <label className="text-gray-900 text-3xl">Iscomplete</label>
                  <input
                    checked={iscomplete}
                    type="checkbox"
                    onChange={(e) => setisComplete(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded "
                  />
                </div>
                <div className="flex flex-col w-80">
                  <label className="text-gray-900 text-3xl">Text</label>
                  <input
                    value={todo}
                    onChange={(e) => setTodo(e.target.value)}
                    placeholder="Your Todo"
                    className="bg-gray-300 rounded-md w-full px-3 py-3 outline-none focus:outline-blue-400"
                  />
                </div>
                {errorupdate && (
                  <p className="text-green-500 font-bold">{errorupdate}</p>
                )}
              </form>
              <div className="flex justify-between">
                <button
                  onClick={() => handleUpdate(selectedTodoId)}
                  type="submit"
                  className="mt-3 px-3 py-3 bg-blue-400 hover:bg-blue-600 rounded-md"
                >
                  Update
                </button>

                <button
                  className="mt-3 px-3 py-3 bg-gray-400 hover:bg-gray-600 rounded-md"
                  onClick={handleModalClose}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 font-bold">{error}</p>}
    </div>
  );
}
