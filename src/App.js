import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'; 
import Footer from './components/footer/Footer';
import Header from './components/header/Header';
// import Home from './components/home/Home';
import TaskBoard from './components/home/TaskBoard';
import EditTask from './components/home/EditTask';
import { ToastContainer } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-toastify/dist/ReactToastify.css';
import ViewTaskDetails from './components/home/ViewTaskDetails';
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        {/* <Route path="/" element={<Home user={user} />} /> */}
        <Route path="/" element={<DndProvider backend={HTML5Backend}><TaskBoard /></DndProvider>} />
        <Route path="/tasks/edit/:id" element={<EditTask />} />
        <Route path="/tasks/view/:id" element={<ViewTaskDetails />} />  

      </Routes>
      <Footer />
      <ToastContainer />
    </Router>
  );
}

export default App;
