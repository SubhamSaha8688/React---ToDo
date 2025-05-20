import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "./services/api";
import Loader from "./components/Loader";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setShowFinished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await api.getTodos();
      setTodos(response.data);
    } catch (error) {
      toast.error("Failed to fetch todos!");
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFinished = () => {
    setShowFinished(!showFinished);
  };

  const handleEdit = (e, id) => {
    let t = todos.find((i) => i._id === id);
    setTodo(t.todo);
    handleDelete(e, id);
  };

  const handleDelete = async (e, id) => {
    try {
      setLoading(true);
      await api.deleteTodo(id);
      const newTodos = todos.filter((item) => item._id !== id);
      setTodos(newTodos);
      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete todo!");
      console.error("Error deleting todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (todo.length <= 3) return;

    try {
      setSubmitting(true);
      const response = await api.createTodo({ todo, isCompleted: false });
      setTodos([response.data, ...todos]);
      setTodo("");
      toast.success("Todo added successfully!");
    } catch (error) {
      toast.error("Failed to add todo!");
      console.error("Error adding todo:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleCheckbox = async (e) => {
    const id = e.target.name;
    const index = todos.findIndex((item) => item._id === id);
    
    try {
      setLoading(true);
      const updatedTodo = {
        ...todos[index],
        isCompleted: !todos[index].isCompleted
      };
      
      const response = await api.updateTodo(id, updatedTodo);
      
      let newTodos = [...todos];
      newTodos[index] = response.data;
      setTodos(newTodos);
      
      toast.success("Todo status updated!");
    } catch (error) {
      toast.error("Failed to update todo status!");
      console.error("Error updating todo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className="font-bold text-center text-3xl">
          iTask - Manage your todos at one place
        </h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Add a Todo</h2>
          <div className="flex">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className="w-full rounded-full px-5 py-1"
              placeholder="Enter your task here..."
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3 || submitting}
              className="bg-violet-800 mx-2 rounded-full hover:bg-violet-950 disabled:bg-violet-500 p-4 py-2 text-sm font-bold text-white flex items-center"
            >
              {submitting ? <Loader size="small" /> : "Save"}
            </button>
          </div>
        </div>
        <input
          className="my-4"
          id="show"
          onChange={toggleFinished}
          type="checkbox"
          checked={showFinished}
        />
        <label className="mx-2" htmlFor="show">
          Show Finished
        </label>
        <div className="h-[1px] bg-black opacity-15 w-[90%] mx-auto my-2"></div>
        <h2 className="text-2xl font-bold">Your Todos</h2>
        <div className="todos">
          {loading && <Loader />}
          {!loading && todos.length === 0 && (
            <div className="m-5">No Todos to display</div>
          )}
          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div key={item._id} className={"todo flex my-3 justify-between"}>
                  <div className="flex gap-5">
                    <input
                      name={item._id}
                      onChange={handleCheckbox}
                      type="checkbox"
                      checked={item.isCompleted}
                    />
                    <div className={item.isCompleted ? "line-through" : ""}>
                      {item.todo}
                    </div>
                  </div>
                  <div className="buttons flex h-full">
                    <button
                      onClick={(e) => handleEdit(e, item._id)}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => {
                        handleDelete(e, item._id);
                      }}
                      className="bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1"
                    >
                      <AiFillDelete />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;