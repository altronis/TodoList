import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { Link } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { Modal } from 'react-materialize';

class ListScreen extends Component {
    state = {
        name: this.props.todoList.name,
        owner: this.props.todoList.owner,
    }

    handleDelete = () => {
        const fireStore = getFirestore();

        fireStore.collection("todoLists").doc(this.props.todoList.id).delete().then(() => {
            console.log("List deleted");
        });   
    }

    handleChange = (e) => {
        const { target } = e;

        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));

        // Update the database 
        const fireStore = getFirestore().collection("todoLists").doc(this.props.todoList.id);

        fireStore.update({
            [target.id]: target.value
        }).then(function() {
            console.log("Database updated");
        })
    }

    componentDidMount() {
        // Set timestamp of todoList to now
        const todoList = this.props.todoList;
        const thisDoc = getFirestore().collection("todoLists").doc(todoList.id);
        const timeNow = Date.now();
        
        thisDoc.update({
            timeStamp: timeNow
        }).then(function() {
            console.log("Timestamp updated");
        });
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        const trigger = <span id="trashcan">&#128465;</span>

        try {
            return (
                <div className="container white">
                    <div className="list_header">
                        <h5 className="header grey-text text-darken-3">Todo List</h5>
                        <Modal header="Delete List?" trigger={trigger}
                            actions={
                                <div className="buttons">
                                    <span id="yes_button" className="dialog_button" onClick={this.handleDelete}>YES</span>
                                    <span id="no_button" className="dialog_button modal-close">NO</span>
                                </div>
                            }
                        >
                            <strong>Are you sure you want to delete this list?</strong> <br />
                            The list will not be retreivable.
                        </Modal>
                    </div>
                    <div className="input-field">
                        <label className="active" htmlFor="email">Name</label>
                        <input className="active" type="text" name="name" id="name" onBlur={this.handleChange} defaultValue={this.state.name} />
                    </div>
                    <div className="input-field">
                        <label className="active" htmlFor="password">Owner</label>
                        <input className="active" type="text" name="owner" id="owner" onBlur={this.handleChange} defaultValue={this.state.owner} />
                    </div>

                    <ItemsList todoList={todoList} />

                    <Link to={'/todoList/' + todoList.id + '/item/' + todoList.items.length}>
                        <div className="list_item_add_card">+</div>
                    </Link>
                </div>
            );
        } catch (e) {
            console.log("Redirecting...");
            return <Redirect to="/" />;
        }
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;

  if (todoList)
    todoList.id = id;

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
)(ListScreen);