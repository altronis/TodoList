import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { Link } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class ListScreen extends Component {
    state = {
        name: this.props.todoList.name,
        owner: this.props.todoList.owner,
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

        return (
            <div className="container white">
                <h5 className="grey-text text-darken-3">Todo List</h5>
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
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
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