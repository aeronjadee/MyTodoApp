import React, { useState } from 'react';

function AddTodoForm(props) {
  const [todoText, setTodoText] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('High');
  const [selectedCategory, setSelectedCategory] = useState('Work');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [dueDateInput, setDueDateInput] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleDueDateChange = (event) => {
    const inputValue = event.target.value;
    const parsedDate = new Date(inputValue);
    if (!isNaN(parsedDate.getTime()) && inputValue.length === 10) {
      setDueDateInput(inputValue);
      setValidationError('');
    } else {
      setDueDateInput(inputValue);
      setValidationError('Please enter a valid due date in YYYY-MM-DD format.');
    }
  };

  const validateDateInput = (dateString) => {
    if (!dateString) return false;
    const parsedDate = new Date(dateString);
    return !isNaN(parsedDate.getTime()) && dateString.length === 10;
  };

  const handleFormSubmission = (event) => {
    event.preventDefault();
    setValidationError('');
    
    if (todoText.trim() === '') return;
    
    if (!dueDateInput) {
      setValidationError('Due date is required. Please enter a valid due date in YYYY-MM-DD format.');
      return;
    }
    
    if (!validateDateInput(dueDateInput)) {
      setValidationError('Please enter a valid due date in YYYY-MM-DD format.');
      return;
    }
    
    const finalCategory = customCategoryInput.trim() ? customCategoryInput.trim() : selectedCategory;
    
    props.onAddTodo(todoText.trim(), selectedPriority, finalCategory, dueDateInput);
    
    setTodoText('');
    setSelectedPriority('High');
    setSelectedCategory('Work');
    setCustomCategoryInput('');
    setDueDateInput('');
  };

  return (
    <form onSubmit={handleFormSubmission} className="add-todo-form">
      <div className="form-row">
        <input
          type="text"
          value={todoText}
          onChange={(event) => setTodoText(event.target.value)}
          placeholder="Add your Todo"
          className="todo-input"
          maxLength={20}
        />
      </div>
      <div className="form-row">
        <select
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          className="category-select"
        >
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
        </select>
        <input
          type="text"
          value={customCategoryInput}
          onChange={(event) => setCustomCategoryInput(event.target.value)}
          placeholder="Or type a custom category"
          className="custom-category-input"
          maxLength={20}
        />
        <select
          value={selectedPriority}
          onChange={(event) => setSelectedPriority(event.target.value)}
          className="priority-select"
        >
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <input
          type="text"
          value={dueDateInput}
          onChange={handleDueDateChange}
          placeholder="Due date (YYYY-MM-DD) *"
          className="due-date-input"
        />
        <button type="submit" className="add-btn">
          Add TODO
        </button>
      </div>
      {validationError && <div className="error-message">{validationError}</div>}
    </form>
  );
}

export default AddTodoForm;