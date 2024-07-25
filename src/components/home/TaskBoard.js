import React, { useEffect, useState } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { Link } from 'react-router-dom'; // Import Link
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Home';
import './TaskBoard.css';

// DraggableTask Component
const DraggableTask = ({ task, onDrop, onDelete }) => {
  const [, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id, status: task.status },
  });

  return (
    <div
      ref={drag}
      className="task-item"
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Created At: {new Date(task.createdAt).toLocaleString()}</p>
      <div className="text-end">
        <Link to={`/tasks/edit/${task._id}`} className="btn btn-danger">Edit</Link>
        <button className="btn btn-info" onClick={() => onDelete(task._id)}>Delete</button>
        <Link to={`/tasks/view/${task._id}`} className="btn btn-primary">View Details</Link>
      </div>
    </div>
  );
};

// Section Component
const Section = ({ status, tasks, onDrop, onDelete }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => onDrop(item.id, status),
  });

  return (
    <div
      ref={drop}
      className="task-column"
    >
      <h2>{status}</h2>
      {tasks.length > 0 ? (
        tasks.map(task => (
          <DraggableTask key={task._id} task={task} onDrop={onDrop} onDelete={onDelete} />
        ))
      ) : (
        <p>No tasks</p>
      )}
    </div>
  );
};

// TaskBoard Component
const TaskBoard = () => {
  const [tasks, setTasks] = useState({ 'To Do': [], 'In Progress': [], 'Done': [] });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4001/api/tasks/list', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          const organizedTasks = {
            'To Do': data.tasks.filter(task => task.status === 'todo'),
            'In Progress': data.tasks.filter(task => task.status === 'In Progress'),
            'Done': data.tasks.filter(task => task.status === 'Done'),
          };
          setTasks(organizedTasks);
        } else {
          console.error('Failed to fetch tasks:', data.message);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleDrop = async (taskId, newStatus) => {
    try {
      // Update local state first
      setTasks(prevTasks => {
        const updatedTasks = { ...prevTasks };
        const task = Object.values(prevTasks).flat().find(task => task._id === taskId);
        if (task) {
          task.status = newStatus;
          updatedTasks[task.status] = [...updatedTasks[task.status], task];
          Object.keys(updatedTasks).forEach(key => {
            if (key !== task.status) {
              updatedTasks[key] = updatedTasks[key].filter(t => t._id !== taskId);
            }
          });
        }
        return updatedTasks;
      });

      // Sync with server
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4001/api/tasks/updateStatus/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to update task status:', data.message);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async (taskId) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        // Update local state first
        setTasks(prevTasks => {
          const updatedTasks = { ...prevTasks };
          Object.keys(updatedTasks).forEach(key => {
            updatedTasks[key] = updatedTasks[key].filter(t => t._id !== taskId);
          });
          return updatedTasks;
        });

        // Sync with server
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4001/api/tasks/delete/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          toast.success('Task deleted successfully!');
        } else {
          console.error('Failed to delete task:', data.message);
          toast.error('Failed to delete task.');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Error deleting task.');
      }
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      <ToastContainer />
      <Home user={user} />
      <div className="task-board">
        <Section status="To Do" tasks={tasks['To Do']} onDrop={handleDrop} onDelete={handleDelete} />
        <Section status="In Progress" tasks={tasks['In Progress']} onDrop={handleDrop} onDelete={handleDelete} />
        <Section status="Done" tasks={tasks['Done']} onDrop={handleDrop} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default TaskBoard;
