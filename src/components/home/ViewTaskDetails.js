import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ViewTaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [user, setUser] = useState(null);

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
        } else {
          console.error('Failed to fetch task:', data.message);
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();

    // Get user info from localStorage
    const storedUser = localStorage.getItem('user');
    console.log(storedUser);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [id]);

  return (
    <div className="container margins">
      <div className="row">
        <div className="col-lg-3"></div>
        <div className="col-lg-6">
          <div className="card shadow border-0 p-2">
            {task ? (
              <div className='p-1'>
                <h4 className="mb-4">Task Details</h4>

                <h5>Title: {task.title}</h5>
                <p>Description: {task.description}</p>
                <p><strong>Created At:</strong> {new Date(task.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Assigned User:</strong> {user ? user.firstName : 'Unknown'}</p>
                <div className="text-center">
                  <button className="btn btn-primary" onClick={() => navigate('/')}>Back to Task Board</button>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
        <div className="col-lg-3"></div>
      </div>
    </div>
  );
};

export default ViewTaskDetails;
