import React, { useState, useEffect } from 'react';
import 'react-dropdown/style.css';
import './App.css';
import Status from './Status';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const App = () => {
  const [statuses, setStatuses] = useState([]);
  const [tasks, setTasks] = useState({});
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState({ open: false, statusIndex: null });
  const [newStatus, setNewStatus] = useState({ name: '', color: '#ffffff', icon: 'icon1' });
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '', dueDate: '', priority: 'low', attachment: '' });



  useEffect(() => {
    const savedStatuses = JSON.parse(localStorage.getItem('statuses'));
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (savedStatuses) setStatuses(savedStatuses);
    if (savedTasks) setTasks(savedTasks);
  }, []);

  useEffect(() => {
    //if (statuses.length > 0) {
      localStorage.setItem('statuses', JSON.stringify(statuses));
    //}
  }, [statuses]);

  useEffect(() => {
    if (Object.keys(tasks).length > 0) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addNewStatus = () => {
    if (newStatus.name === "" || newStatus.name === undefined || newStatus.name === null) {
      alert("Please enter a valid status name ");
      return;
    }
    const updatedStatuses = [...statuses, newStatus];
    setStatuses(updatedStatuses);
    tasks[newStatus.name] = [];
    setNewStatus({ name: '', color: '#ffffff', icon: 'icon1' });
    setStatusModalOpen(false);
  };


  const clearStorage = () => {
    localStorage.clear();
  }


  const addNewTask = () => {
    const updatedTasks = { ...tasks };
    const statusKey = statuses[isTaskModalOpen.statusIndex].name;

    if (!updatedTasks[statusKey]) {
      updatedTasks[statusKey] = [];
    }

    updatedTasks[statusKey].push(newTask);

    setTasks(updatedTasks);
    setNewTask({ title: '', description: '', assignee: '', dueDate: '', priority: 'low', attachment: '' });
    setTaskModalOpen({ open: false, statusIndex: null });
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewTask({ ...newTask, attachment: file });
    }
  };

  const onDragEnd = (result) => {
    const { type, destination, source, draggableId } = result;

    if (!destination) return;


    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'TASK') {
      const sourceStatus = source.droppableId;
      const destinationStatus = destination.droppableId;
      const updatedTasks = { ...tasks };

      const [removedTask] = updatedTasks[sourceStatus].splice(source.index, 1);

      if (!updatedTasks[destinationStatus]) {
        updatedTasks[destinationStatus] = [];
      }

      updatedTasks[destinationStatus].splice(destination.index, 0, removedTask);

      setTasks(updatedTasks);
    }
    else {
      const reorderedStatuses = statuses;
      const [movedStatus] = reorderedStatuses.splice(source.index, 1);
      reorderedStatuses.splice(destination.index, 0, movedStatus);

      setStatuses(reorderedStatuses);
    }

  };

  // const deletestatus = (index) => {
  //   const removedStatus = statuses.splice(index, 1);
  //   console.log(statuses);
  //   console.log(removedStatus);
  //   setStatuses(statuses);
  // }

  const deleteStatus = (index) => {
    console.log(index);
    setStatuses((prevStatuses) => prevStatuses.filter((_, i) => (i !== index)));
    console.log(statuses);
  };

  return (
    <div className="container">
      <button className="add-status-btn" onClick={() => setStatusModalOpen(true)}>+ Add Status</button>

      {isStatusModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Status</h3>
            <input
              type="text"
              placeholder="Status Name"
              value={newStatus.name}
              onChange={(e) => setNewStatus({ ...newStatus, name: e.target.value })}
              className="modal-input"
              required
            />
            <label>
              Choose Color:
              <input
                type="color"
                value={newStatus.color}
                onChange={(e) => setNewStatus({ ...newStatus, color: e.target.value })}
                className="color-picker"
              />
            </label>
            <label>
              Choose Icon:
              <select
                value={newStatus.icon}
                onChange={(e) => setNewStatus({ ...newStatus, icon: e.target.value })}
                className="icon-select"
              >
                <option value="icon1">Icon 1</option>
                <option value="icon2">Icon 2</option>
              </select>
            </label>
            <div className="modal-buttons">
              <button className="save-btn" onClick={addNewStatus}>Save</button>
              <button className="cancel-btn" onClick={() => setStatusModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isTaskModalOpen.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Task</h3>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="modal-input"
              required
            />
            <input
              type="text"
              placeholder="Assignee"
              value={newTask.assignee}
              onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="modal-input"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="modal-input"
            />
            <label>
              Priority:
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="modal-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              Attachment:
              <input
                type="file"
                onChange={(e) => handleFileChange(e)}
                className="modal-input"
              />
            </label>
            <div className="modal-buttons">
              <button className="save-btn" onClick={addNewTask}>Save Task</button>
              <button className="cancel-btn" onClick={() => setTaskModalOpen({ open: false, statusIndex: null })}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="board-container">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="statuses" key="statuses" type="STATUS" direction='horizantal'>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="board">
                {statuses.map((status, index) => (
                  <Draggable key={status.name} draggableId={status.name} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="status-container"
                      >
                        <Status
                          key={index}
                          status={status}
                          tasks={tasks[status.name] || []}
                          setTaskModalOpen={setTaskModalOpen}
                          index={index}
                          deleteStatus = {deleteStatus}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default App;
