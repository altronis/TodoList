import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { Button, Icon } from 'react-materialize';
import { getFirestore } from 'redux-firestore';

class ItemCard extends React.Component {
    state = {
        redirect: false
    }

    moveUpItem = (e) => {
        e.stopPropagation();
        const item = this.props.item;
        let itemsArray = [...this.props.todoList.items];
        const index = this.findItemIndex(itemsArray, item.key);
        
        if (index != 0) {
            itemsArray.splice(index, 1);
            itemsArray.splice(index - 1, 0, item);

            const fireStore = getFirestore();
            fireStore.collection("todoLists").doc(this.props.todoList.id).update({
                items: itemsArray
            }).then(() => {
                console.log("Item moved up");
            });
        }
    }

    moveDownItem = (e) => {
        e.stopPropagation();
        const item = this.props.item;
        let itemsArray = [...this.props.todoList.items];
        const index = this.findItemIndex(itemsArray, item.key);
        
        if (index < itemsArray.length) {
            itemsArray.splice(index, 1);
            itemsArray.splice(index + 1, 0, item);

            const fireStore = getFirestore();
            fireStore.collection("todoLists").doc(this.props.todoList.id).update({
                items: itemsArray
            }).then(() => {
                console.log("Item moved down");
            });
        }
    }

    removeItem= (e) => {
        e.stopPropagation();
        const item = this.props.item;
        let itemsArray = [...this.props.todoList.items];
        const index = this.findItemIndex(itemsArray, item.key);
        
        itemsArray.splice(index, 1);

        const fireStore = getFirestore();
        fireStore.collection("todoLists").doc(this.props.todoList.id).update({
            items: itemsArray
        }).then(() => {
            console.log("Item removed");
        });
    }

    findItemIndex = (itemsArray, key) => {
        for (var i = 0; i < itemsArray.length; i ++) {
            if (itemsArray[i].key == key)
                return i;
        }

        return -1;
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

        const statusClass = item.completed ? " completed" : " pending";

        return (
            <tr id={"item" + this.props.item.id} className="item_row" onClick={this.redirect}>
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
                    <span className={"card-title" + statusClass}>{item.completed ? "Completed" : "Pending"}</span>
                </td>
                <td>
                    <Button
                        floating
                        fab={{direction: 'left'}}
                        >
                        <Button floating icon={<Icon>arrow_upward</Icon>} onClick={this.moveUpItem} className={this.props.first ? "grey action" : "blue action"} />
                        <Button floating icon={<Icon>arrow_downward</Icon>} onClick={this.moveDownItem} className={this.props.last ? "grey action" : "blue action"} />
                        <Button floating icon={<Icon>clear</Icon>} onClick={this.removeItem} className="red action" />
                        </Button>
                </td>
            </tr>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const todoList = ownProps.todoList;
    return {
        todoList,
        auth: state.firebase.auth,
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'todoLists' },
    ]),
)(ItemCard);
