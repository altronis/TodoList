import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.datepicker');
});

class ItemScreen extends Component {
    state = {
        redirect: false
    }

    handleCancel = () => {
        this.setState({redirect: true});
    }

    handleSubmit = (event) => {
        const itemIndex = parseInt(this.props.itemId);
        let itemList = this.props.todoList.items;

        // Get the values in the form
        event.preventDefault();
        let newDescription;
        let newAssignedTo;
        let newDueDate;
        let newCompleted;

        if (event.target[0].value.trim() === "")
        newDescription = "Unknown";
        else
        newDescription = event.target[0].value;
        
        if (event.target[1].value.trim() === "")
        newAssignedTo = "Unknown";
        else
        newAssignedTo = event.target[1].value;

        if (event.target[2].value === "")
        newDueDate = new Date().toISOString().substring(0, 10);
        else
        newDueDate = event.target[2].value;
        
        newCompleted = event.target[3].checked;
        
        // Create an item object
        let newItem = {
            "key": itemIndex,
            "description": newDescription,
            "due_date": newDueDate,
            "assigned_to": newAssignedTo,
            "completed": newCompleted
        }

        // Update database 
        itemList[itemIndex] = newItem;
        const fireStore = getFirestore();
        fireStore.collection("todoLists").doc(this.props.todoList.listId).update({
            items: itemList
        }).then(() => {
            console.log("Item updated");
            this.setState({redirect: true});
        });
    }

    render() {
        const auth = this.props.auth;
        const item = this.props.todoList.items[this.props.itemId];

        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        if (this.state.redirect) {
            return <Redirect to={"/todoList/" + this.props.todoList.listId} />;
        }

        return (
            <div className="row">
                <form className="container white" id="todo_item" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div id="item_heading">Item</div>
                    </div>   

                    <div className="row">
                        <div className="input-field col s12">
                            <input id="description" type="text" defaultValue={item ? item.description : ""} />
                            <label className="active" for="description">Description</label>
                        </div>
                    </div>   

                    <div className="row">
                        <div className="input-field col s12">
                            <input id="assigned_to" type="text" defaultValue={item ? item.assigned_to : ""} />
                            <label className="active" for="assigned_to">Assigned To</label>
                        </div>
                    </div>      

                    <div className="row">
                        <div className="input-field col s12">
                            <input id="due_date" type="date" defaultValue={item ? item.due_date : new Date().toISOString().substring(0, 10)} />
                            <label className="active" for="due_date">Due Date</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s12">
                            <label>
                                <input type="checkbox" id="item_completed_checkbox" className="filled-in item_input" defaultChecked={item ? item.completed : false}/>
                                <span>Completed</span>
                            </label>
                        </div>
                    </div>

                    <br></br>
                    <div id="item_form_buttons">
                        <button id="submit_button" className="item_form_button">Submit</button>
                        <button id="cancel_button" className="item_form_button" onClick={this.handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const listId = ownProps.match.params.id;
  const itemId = ownProps.match.params.itemId;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[listId] : null;
  todoList.listId = listId;

  return {
    todoList,
    itemId,
    auth: state.firebase.auth,
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ItemScreen);