import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
      let todoString = localStorage.getItem("todos")
      if(todoString) {
        let todos = JSON.parse(localStorage.getItem("todos"))
        setTodos(todos)
      }
    }, [])
    

  const saveToLS = (params) => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }
  
  const handleChange = (e)=> {
    setTodo(e.target.value)
  }
  
  const handleAdd = ()=> {
    setTodos([...todos, {id: uuidv4(), todo, isCompleted: false}])
    setTodo("")
    console.log(todos)
    saveToLS()
  }

  const handleCheckbox = (e) => {
    let id = e.target.name;
    let index = todos.findIndex(item => {
      return item.id === id
    })
    let newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
    saveToLS()
  }

  const handleEdit = (e, id)=> {
    let t = todos.filter(i=>i.id === id) 
    setTodo(t[0].todo)
    let newTodos = todos.filter(item=>{
      return item.id!==id
    }); 
    setTodos(newTodos) 
    saveToLS()
  }

  const handleDelete = (id)=> {
    setDeleteId(id);
    setShowModal(true);
  }

  const confirmDelete = () => {
    let newTodos = todos.filter(item => item.id !== deleteId);
    setTodos(newTodos);
    setShowModal(false);
    saveToLS()
  };

  return (
    <>
    <div className='min-h-screen bg-linear-to-br from-pink-200 via-pink-100  to-pink-300'>
    <Navbar/>
      <div className="container max-w-4xl h-[85vh] mx-auto my-5 rounded-xl p-4 sm:p-5 bg-pink-100 shadow-2xl overflow-auto flex flex-col">

        <div className='sticky top-0 bg-pink-100/80 backdrop-blur-md z-10 pb-3'>
        <h1 className='font-bold text-center text-xl sm:text-3xl text-shadow-sm text-shadow-pink-600'>SlayList - Manage your todos at one place</h1>

        <div className='h-[0.1px] bg-pink-600/10 my-4 mx-20'></div>

        <div className="addTodo my-2">
          <h2 className='text-xl font-bold text-center my-1 text-shadow-lg'>Add a Todo</h2>

          <div className='flex flex-col sm:flex-row gap-3 justify-center my-3 items-center'>
            <input onChange={handleChange} value={todo} className='border-2 border-pink-600 rounded-full shadow-lg w-full sm:w-3/4 px-5 py-2' type="text" placeholder='Add a Task' />
            <button onClick={handleAdd} disabled={todo.length < 3} className='w-full sm:w-auto cursor-pointer font-semibold bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-500/50 transition-all disabled:hover:cursor-not-allowed px-5 py-2 text-white rounded-full border border-pink-700'>Add</button>
          </div>
        </div>
        </div>

        <h2 className='text-xl font-bold text-center my-1 text-shadow-lg'>Your Todos</h2>

        <div className="text-center text-sm text-gray-700 my-2 text-shadow-sm">
          {todos.filter(t => t.isCompleted).length} / {todos.length} Completed
        </div>

        <div className="flex justify-center gap-3 my-4 flex-wrap">
          {["all", "active", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm font-semibold cursor-pointer transition-all
                ${filter === f 
                  ? "bg-pink-600 border border-pink-700 text-white shadow-lg text-shadow-2xs text-shadow-black" 
                  : "bg-gray-200 border border-gray-300 text-gray-700 text-shadow-md"}`}
                    >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="todos overflow-y-auto shadow-xs flex-1 pl-3 pr-4">
          {todos.length === 0 && <div className='my-5'>
            No Todos to Display
          </div>}
          
          <AnimatePresence>
          {todos.filter(item => {
            if (filter === "active") return !item.isCompleted;
            if (filter === "completed") return item.isCompleted;
            return true;
          })
          .map(item=> {
            return <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.2 }} className="todo bg-white/30 backdrop-blur-lg border border-white/20 p-3 rounded-full shadow-md flex flex-col sm:flex-row sm:justify-between w-full my-3 gap-3 sm:items-center transition-all duration-300 hover:scale-101 hover:bg-white/40 hover:shadow-xl cursor-pointer">

              <div className='flex gap-3 w-full'>
                <input onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} className='accent-pink-600 scale-125 cursor-pointer transition-all duration-300 hover:scale-150' name={item.id} id="" />

                <div className='relative'>
                  <span className={`wrap-break-word ${item.isCompleted ? "text-gray-400" : ""}`}>{item.todo}</span>
                  {item.isCompleted && (
                    <span className='absolute left-0 top-1/2 w-full h-px bg-pink-500 animate-[strike_0.3s_ease-out]'></span>
                  )}
                </div>
              </div>

              <div className="buttons flex gap-1 justify-end sm:justify-normal">
                <button onClick={(e)=>handleEdit(e, item.id)} className='cursor-pointer font-semibold bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-500/50 transition-all px-4 py-2 text-white rounded-full mx-1 border-pink-700'><FaEdit /></button>
                <button onClick={()=> handleDelete(item.id)} className='cursor-pointer font-semibold bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-pink-500/50 transition-all px-4 py-2 text-white rounded-full mx-1 border-pink-700'><AiFillDelete /></button>
              </div>
            </motion.div>
          })}
          </AnimatePresence>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white p-6 rounded-xl shadow-lg w-80">
                <h2 className="text-lg font-semibold mb-4">Delete Todo?</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete this todo?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="cursor-pointer px-4 py-2 bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <button onClick={handleAdd} disabled={todo.length < 3} className="fixed bottom-6 right-6 sm:hidden bg-pink-600 text-white p-4 rounded-full text-3xl shadow-2xl cursor-pointer hover:bg-pink-700 transition-all hover:scale-110 active:scale-95 disabled:hover:cursor-not-allowed border border-pink-700"><IoAdd /></button>
    </div>
    </>
  )
}

export default App
