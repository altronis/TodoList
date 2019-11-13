import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks'
import { getFirestore } from 'redux-firestore';

let needToUpdate;

class HomeScreen extends Component {
    state = {
        // ID of the new list 
        newListID: null,
    }

    handleNewList = () => {
        const fireStore = getFirestore();
        let id = "0";  // ID of the new list

        // Find the ID for a new list 
        fireStore.collection("todoLists").orderBy("order", "desc").limit(1).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                id = (doc.data().order + 1).toString();
            });
        })
        // Add a new list
        .then(function() {fireStore.collection('todoLists').doc(id).set({
            name: "Unknown",
            owner: "Unknown", 
            items: [],
            order: parseInt(id),
            timeStamp: Date.now()  // Last accessed
        }) })
        // Update the newListID state variable so that the component gets re-rendered
        .then(() => {
                needToUpdate = true;  // We need to wait for the store to get updated
                this.setState({newListID: id});
        });
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        // Only redirect to list screen if store is updated
        if (this.state.newListID && !needToUpdate) {
            return <Redirect to={"/todoList/" + this.state.newListID} />;
        }

        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <TodoListLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            @todo<br />
                            List Maker
                        </div>
                        
                        <div className="home_new_list_container">
                                <button className="home_new_list_button" onClick={this.handleNewList}>
                                    Create a New To Do List
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    needToUpdate = false;  // No longer need to update store
    return {
        todoLists: state.firestore.ordered.todoLists,
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'todoLists' },
    ]),
)(HomeScreen);