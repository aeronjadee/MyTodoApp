import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import AddTodoForm from './AddToDoForm';
import './App.css';

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn React basics', completed: false, priority: 'High', category:'Work', dueDate: '2025-08-09' },
    { id: 2, text: 'Build a TODO app', completed: false, priority: 'Medium', category:'Personal', dueDate: '2025-08-09'},
    { id: 3, text: 'Master React hooks', completed: false, priority: 'Low', category:'Shopping', dueDate: '2025-08-09' },
  ]);
  const [nextId, setNextId] = useState(4);
  const [sortBy, setSortBy] = useState('priority'); // 'priority', 'dueDate'
  const [searchInput, setSearchInput] = useState('');
  const [filterOption, setFilterOption] = useState('All');

  // to load the item in todos
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedNextId = localStorage.getItem('nextId');
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    } else {
      // Default todos if none saved
      setTodos([
        { id: 1, text: 'Learn React basics', completed: false, priority: 'High', category:'Work', dueDate: '2024-12-25' },
        { id: 2, text: 'Build a TODO app', completed: false, priority: 'Medium', category:'Personal', dueDate: '2024-12-30' },
        { id: 3, text: 'Master React hooks', completed: false, priority: 'Low', category:'Shopping', dueDate: '2024-12-28' },
      ]);
      setNextId(4);
    }
    
    if (savedNextId) {
      setNextId(parseInt(savedNextId));
    }
  }, []); // Empty dependency array means this runs once on mount

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos)); // convert json stringify because local storage doesnt accept array
    }
  }, [todos]); // This runs whenever todos array changes

  // Save nextId to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nextId', nextId.toString());
  }, [nextId]);

  const addTodo = (text, priority, category, dueDate) => {
    const newTodo = {
      id: nextId,
      text: text,
      completed: false,
      priority: priority,
      category: category,
      dueDate: dueDate,
    };
    setTodos([...todos, newTodo]); // icocopy muna yung old items tsaka gagawa ng panibago
    setNextId(nextId + 1);
  };
  //check or uncheck if tapos na ang task
   const toggleTodo = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My TODO App</h1>
      </header>
      <main>
        <AddTodoForm onAddTodo={addTodo} />
        <div className="sort-controls">
          <label>Sort by: </label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
          <label>Filter by: </label>
          <select value={filterOption} onChange={e => setFilterOption(e.target.value)} className="filter-select">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
          
          <input
            type="text"
            placeholder="Search todos"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="search-input"
            
          />
        </div>
        <ul className="todo-list">
          {todos
            .filter(todo => todo.text.toLowerCase().includes(searchInput.toLowerCase()))
            .sort((a, b) => {
              if (sortBy === 'priority') {
                const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              } else if (sortBy === 'dueDate') {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
              }
              return 0;
            })
            .filter(todo => {
              if (filterOption === 'All') return true;
              if (filterOption === 'Active') return !todo.completed;
              if (filterOption === 'Completed') return todo.completed;
              if (filterOption === 'Overdue') return todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
              return false;
            })
            .map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))}
          {searchInput && todos
            .filter(todo => todo.text.toLowerCase().includes(searchInput.toLowerCase()))
            .sort((a, b) => {
              if (sortBy === 'priority') {
                const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
              } else if (sortBy === 'dueDate') {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
              }
              return 0;
            })
            .filter(todo => {
              if (filterOption === 'All') return true;
              if (filterOption === 'Active') return !todo.completed;
              if (filterOption === 'Completed') return todo.completed;
              if (filterOption === 'Overdue') return todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
              return false;
            }).length === 0 && (
            <li className="alert-no-todos">No todos found.</li>
          )}
        </ul>
        <div className="todo-stats">
          <p>Total: {todos.length} | Completed: {todos.filter(t => t.completed).length}</p>
        </div>
      </main>
    </div>
  );
}

export default App;
