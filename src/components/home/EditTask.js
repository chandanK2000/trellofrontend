import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4001/api/tasks/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTask(data.task);
          setTitle(data.task.title);
          setDescription(data.task.description);
        } else {
          console.error('Failed to fetch task:', data.message);
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4001/api/tasks/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Task updated successfully!');
        navigate('/'); 
        setTimeout(() => {
          window.location.reload(); 
        }, 500);
      } else {
        console.error('Failed to update task:', data.message);
        toast.error('Failed to update task.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error updating task.');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container margins">
      <div className="row">
        <div className="col-lg-2"></div>
        <div className="col-lg-8 ">
          <div className="card shadow border-0">
            {task ? (
              <form onSubmit={handleSubmit} className='p-4'>
                <h4 className="mb-4">Edit Task</h4>

                <div className="mb-3">
                  <label className="form-label">Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description:</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={5}
                  ></textarea>
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary mr-1"
                  >
                    Update Task
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                </div>
              </form>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <div className="col-lg-2"></div>
      </div>
    </div>
  );
};

export default EditTask;
