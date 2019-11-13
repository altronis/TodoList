import React from 'react';
import { Redirect } from 'react-router-dom';

class ItemCard extends React.Component {
    state = {
        redirect: false
    }

    redirect = () => {    
        this.setState({redirect: true});
    }

    render() {
        const { item } = this.props; 

        if (this.state.redirect) {
            const { item } = this.props;
            const url = '/todoList/' + this.props.todoList.id + '/item/' + item.key;
            return (
                <Redirect to={url} />
            );
        }

        return (
            <tr className="item_row" onClick={this.redirect}>
                <td>
                    <span className="card-title">{item.description}</span>
                </td>
                <td>
                    <span className="card-title">{item.assigned_to}</span>
                </td>
                <td>
                    <span className="card-title">{item.due_date}</span>
                </td>
                <td>
                    <span className="card-title">{item.completed ? "Completed" : "Pending"}</span>
                </td>
            </tr>
        );
    }
}
export default ItemCard;