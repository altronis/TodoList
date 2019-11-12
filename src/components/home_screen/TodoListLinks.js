import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TodoListCard from './TodoListCard';

class TodoListLinks extends React.Component {
    compare(first, second) {
        let firstTime = first.timeStamp;
        let secondTime = second.timeStamp;

        if (firstTime < secondTime)
            return 1;

        if (firstTime > secondTime)
            return -1;
        
        return 0;
    }

    render() {
        // Copy this.props.todoLists
        let todoLists;

        if (this.props.todoLists != null) {
            todoLists = [...this.props.todoLists];

            // Sort todoLists by decreasing timeStamp 
            todoLists.sort(this.compare);
        }

        return (
            <div className="todo-lists section">
                {todoLists && todoLists.map(todoList => (
                    <Link to={'/todoList/' + todoList.id} key={todoList.id}>
                        <TodoListCard todoList={todoList} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        todoLists: state.firestore.ordered.todoLists,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(TodoListLinks);