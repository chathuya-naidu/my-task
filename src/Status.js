import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'; // Import icons

const Status = ({ status, tasks, setTaskModalOpen, index }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="status-row" style={{ backgroundColor: status.color }}>
      <div className="status-header" onClick={toggleExpanded}>
        <div className="status-title">
          <h3>{status.name}</h3>
        </div>

        <div className="status-controls">

          <span className="toggle-icon">
            {isExpanded ? (
              <FontAwesomeIcon icon={faChevronDown} />
            ) : (
              <FontAwesomeIcon icon={faChevronUp} />
            )}
          </span>
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
