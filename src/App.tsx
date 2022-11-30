import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskList from "./task/TaskList";
import TaskAdd from "./task/TaskAdd";
import TaskView from "./task/TaskView";
import TaskEdit from "./task/TaskEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/view/:id" element={<TaskView />} />
        <Route path="/add" element={<TaskAdd />} />
        <Route path="/edit/:id" element={<TaskEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
