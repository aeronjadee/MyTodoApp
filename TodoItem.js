import React, { useState } from 'react';

function TodoItem(props) {
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [editedText, setEditedText] = useState(props.todo.text);
  const [errorMessage, setErrorMessage] = useState('');

  const saveChanges = () => {
    if (editedText.trim() === '') {
      setErrorMessage('Todo text cannot be empty.');
      return;
    }
    props.onEdit(props.todo.id, editedText.trim());
    setIsInEditMode(false);
    setErrorMessage('');
  };

  const cancelEditing = () => {
    setIsInEditMode(false);
    setEditedText(props.todo.text);
    setErrorMessage('');
  };

  const getPriorityColorCode = (priorityLevel) => {
    const colorMap = {
      'High': '#ff4444',
      'Medium': '#ffaa00',
      'Low': '#44aa44'
    };
    return colorMap[priorityLevel] || '#666666';
  };

  const getPriorityDisplayText = (priorityLevel) => {
    const displayMap = {
      'High': '🔴 High',
      'Medium': '🟡 Medium',
      'Low': '🟢 Low'
    };
    return displayMap[priorityLevel] || priorityLevel;
  };

  const getCategoryDisplayText = (categoryName) => {
    const categoryMap = {
      'Work': 'Work',
      'Personal': 'Personal',
      'Shopping': 'Shopping'
    };
    return categoryMap[categoryName] || categoryName;
  };

  const getDueDateColorCode = (dueDateString) => {
    if (!dueDateString) return 'blue';

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateString);
    dueDate.setHours(0, 0, 0, 0);   
    
    if (dueDate < currentDate) {
      return 'red';
    } else if (dueDate.getTime() === currentDate.getTime()) {
      return 'yellow';
    } else {
      return 'green';
    }
  };

  const formatDateDisplay = (dateString) => {
    const dateObject = new Date(dateString);
    return dateObject.toLocaleDateString();
  };

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={props.todo.completed}
        onChange={() => props.onToggle(props.todo.id)}
      />
      {isInEditMode ? (
        <>
          <div className="edit-container">
            <input
              className="edit-input"
              value={editedText}
              onChange={event => setEditedText(event.target.value)}
              maxLength={32}
            />
            <div className="edit-buttons">
              <button onClick={saveChanges} className="save-btn">Save</button>
              <button onClick={cancelEditing} className="cancel-btn">Cancel</button>
            </div>
            {errorMessage && <span className="error-message">{errorMessage}</span>}
          </div>
        </>
      ) : (
        <>
          <span className={props.todo.completed ? 'completed' : ''}>{props.todo.text}</span>
        </>
      )}
      <span 
        className="priority-container"
        style={{ 
          backgroundColor: getPriorityColorCode(props.todo.priority),
        }}
      >
        {getPriorityDisplayText(props.todo.priority)}
      </span>
      {props.todo.category && (
        <span 
          className="category-badge">
          {getCategoryDisplayText(props.todo.category)}
        </span>
      )}
      {props.todo.dueDate && (
        <span 
          className="due-date-badge"
          style={{ 
            backgroundColor: getDueDateColorCode(props.todo.dueDate),
            color: 'white'
          }}
        >
           {formatDateDisplay(props.todo.dueDate)}
        </span>
      )}
      {!isInEditMode && (
        <button onClick={() => setIsInEditMode(true)} className="edit-btn">Edit</button>
      )}
      <button
        onClick={() => props.onDelete(props.todo.id)}
        className="delete-btn"
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem;