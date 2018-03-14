const { Component } = React;

// is this an OK hack?
const getPassInputValue = (fn, property='value') => (e) => fn(e.target[property]);

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      filter: '',
      showCompleted: true,
      todos: []
    }
  }
  
  handleFilterChange(filter) {
    this.setState({ filter });
  }
  handleShowCompletedChange(showCompleted) {
    this.setState({ showCompleted });
  }
  
  handleDeleteTodo(todo) {
    const {
      todos
    } = this.state;
   
    todos.splice(todos.indexOf(todo), 1);
    
    this.setState({
      todos
    })
  }
  handleModifyTodo(todo, name) {
    // uhm, side effects. Best way to solve?
    // I can imagine deep-cloning the array, but it just feels wrong and unneeded
    todo.name = name;
    
    this.setState({
      todos: this.state.todos
    })
  }
  handleCompleteTodo(todo) {
    todo.completed = true;
    
    this.setState({
      todos: this.state.todos
    })
  }
  
  handleAddTodo(todo) {
    // again, maybe I should do `this.setState({ todos: [...this.state.todos, todo] })`
    // at least to be consistent with handleDeleteTodo
    this.state.todos.push(todo);
    
    this.setState({
      todos: this.state.todos
    });
  }
  
  render() {
    const {
      filter,
      showCompleted,
      todos
    } = this.state;
    
    return (
      <div>
        <TodoControls
          onFilterChange={this.handleFilterChange.bind(this)}
          onShowCompletedChange={this.handleShowCompletedChange.bind(this)}
          filter={filter}
          showCompleted={showCompleted}
        />
        <TodoDisplay 
          todos={todos} 
          filter={filter}
          showCompleted={showCompleted}
          onDeleteTodo={this.handleDeleteTodo.bind(this)}
          onModifyTodo={this.handleModifyTodo.bind(this)}
          onCompleteTodo={this.handleCompleteTodo.bind(this)}
          onAddTodo={this.handleAddTodo.bind(this)}
        />
      </div>
    )
  }
}
          
const TodoControls = (props) => {
  const {
    filter,
    showCompleted,
    
    onFilterChange,
    onShowCompletedChange
  } = props;
  
  return (
    <div>
      <p>
        <label>
          <input 
            onChange={getPassInputValue(onFilterChange)} 
            placeholder="filter"
            value={filter}
          />
          filter
        </label>
      </p>
      <p>
        <label>
          <input 
            type="checkbox"
            onChange={getPassInputValue(onShowCompletedChange, 'checked')}
            checked={showCompleted}
          />
          show completed
        </label>
      </p>
    </div>
  )
}

const TodoDisplay = (props) => {
  const {
    todos,
    filter,
    showCompleted,
    onDeleteTodo,
    onModifyTodo,
    onCompleteTodo,

    onAddTodo
  } = props;

  // can't find a nice descriptive name for this, but it's not a react issue
  const completionFilteredTodos = showCompleted ? todos : todos.filter((todo) => !todo.completed);
  const filteredTodos = completionFilteredTodos.filter((todo) => todo.name.includes(filter));
  
  const listProps = {
    todos: filteredTodos,
    onDeleteTodo,
    onModifyTodo,
    onCompleteTodo
  };

  const addTodoProps = {
    onAddTodo
  };

  return (
    <div>
      <TodoList {...listProps} />
      <br />
      <TodoAdd {...addTodoProps} />
    </div>
  )
}

const TodoList = (props) => {
  const {
    todos,
    
    onDeleteTodo,
    onModifyTodo,
    onCompleteTodo
  } = props;
  
  // should I make it a class simply because of the handles?
  const getHandleDeletion = (todo) => () => onDeleteTodo(todo)
  const getHandleModification = (todo) => (newName) => onModifyTodo(todo, newName);
  const getHandleCompletion = (todo) => () => onCompleteTodo(todo);

  return (
    <div>
      {todos.map((todo, i) => (
          <Todo
            todo={todo}
            onDelete={getHandleDeletion(todo)}
            onModify={getHandleModification(todo)}
            onComplete={getHandleCompletion(todo)}

            key={todo.id}
          />
        ))}
    </div>
  )
}

const Todo = (props) => {
  const {
    todo,
    onDelete,
    onModify,
    onComplete
  } = props;
  
  return (
    <div>
      <input 
        value={todo.name} 
        onChange={getPassInputValue(onModify)}
      />
      {todo.completed ?
        'completed'
        :
        <button onClick={onComplete}>complete</button>
      }
      <button onClick={onDelete}>delete</button>
    </div>
  )
}

class TodoAdd extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      name: 'your first Todo!'
    }
    
    this.increment = 1;
  }
  
  handleNameChange(name) {
    this.setState({ name })
  }
  
  handleAdd() {
    this.props.onAddTodo({
      name: this.state.name,
      completed: false,
      id: this.increment++
    })  
    
    this.handleNameChange(`Todo #${this.increment}`);
  }
  
  render() {
    const {
      name
    } = this.state;
    
    return (
      <div>
        <input
          value={name}
          onChange={getPassInputValue(this.handleNameChange.bind(this))}
        />
        <button onClick={this.handleAdd.bind(this)}>add</button>
      </div> 
    )
  }
}

ReactDOM.render(<App />, app);
