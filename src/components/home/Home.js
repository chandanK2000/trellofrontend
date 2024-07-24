import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Home = ({ user }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const currentDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:4001/api/tasks/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskTitle,
          description: taskDescription,
          createdAt: currentDate,
        }),
      });

      if (response.ok) {
        toast.success('Task added successfully!');
        setTaskTitle('');
        setTaskDescription('');
        document.querySelector('#taskModal').classList.remove('show');
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add task: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while adding the task.');
    }
  };

 

  return (
    <div className='container mt-5'>
      {user ? (
        <>
          <button className='btn btn-primary my-4' data-toggle="modal" data-target="#taskModal">Add Task</button>
          <div className='row mb-2'>
            <div className="col-lg-4">
              <label htmlFor="searchTerm">Search:</label>
              <input
                type="text"
                className="form-control"
                id="searchTerm"
                placeholder="Search tasks"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-lg-4">
              <label htmlFor="sortOption">Sort By:</label>
              <select
                className="form-control"
                id="sortOption"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="recent">Recent</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>

      
          <div className="modal fade" id="taskModal" tabIndex="-1" role="dialog" aria-labelledby="taskModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="taskModalLabel">Add New Task</h5>
                  <button type="button" className="close btn btn-primary" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="taskTitle">Task Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="taskTitle"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="taskDescription">Description</label>
                      <textarea
                        className="form-control"
                        id="taskDescription"
                        rows="3"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="taskCreatedAt">Created At</label>
                      <input
                        type="text"
                        className="form-control"
                        id="taskCreatedAt"
                        value={currentDate}
                        readOnly
                        disabled
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Save</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className='' role='alert'>
          Please log in to add tasks.
        </div>
      )}
    </div>
  );
};

export default Home;
