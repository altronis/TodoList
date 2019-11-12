import React from 'react';
import { Link } from 'react-router-dom';

class ItemCard extends React.Component {
    render() {
        const { item } = this.props;  
        return (
            <Link to={'/todoList/' + this.props.todoList.id + '/item/' + item.key}>
                <div className="card z-depth-0 todo-list-link pink-lighten-3">
                    <div className="card-content grey-text text-darken-3">
                        <span className="card-title">{item.description}</span>
                    </div>
                </div>
            </Link>
        );
    }
}
export default ItemCard;