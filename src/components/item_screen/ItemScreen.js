import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class ItemScreen extends Component {
    render() {
        const auth = this.props.auth;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div>
                Hi, i am item {this.props.itemId}
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