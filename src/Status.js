import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faTrash } from '@fortawesome/free-solid-svg-icons';


const Status = ({ status, tasks, setTaskModalOpen, index, deleteStatus }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };



  return (
    <div className="status-row" style={{ backgroundColor: status.color }}>
      <div>
        <div className="status-header" >
          <div className="status-controls" onClick={toggleExpanded}>

            <span className="toggle-icon">
              {isExpanded ? (
                <FontAwesomeIcon icon={faChevronDown} />
              ) : (
                <FontAwesomeIcon icon={faChevronUp} />
              )}
            </span>

          </div>

          <div className="status-title">
            <h3>{(status.name.length > 15) ? (status.name.substring(0, 15) + "...") : status.name}</h3>
          </div>
          <div className="status-delete" onClick={() => deleteStatus(index)}>
            <FontAwesomeIcon icon={faTrash} />
          </div>

        </div>
      </div>

      <button className="add-task-btn" onClick={() => setTaskModalOpen({ open: true, statusIndex: index })}>
        + Add Task
      </button>

      {isExpanded && (
        <Droppable droppableId={status.name} key={status.name} type="TASK">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="task-list">
              {tasks.map((task, idx) => (
                <Draggable key={task.title} draggableId={task.title} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="task-card"
                      key={idx}
                    >
                      <h4>{task.title}</h4>
                      <p>Assignee: {task.assignee}</p>
                      <p>Due: {task.dueDate}</p>
                      <p>Priority: {task.priority}</p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default Status;
