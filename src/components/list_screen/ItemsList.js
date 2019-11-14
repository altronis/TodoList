import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemCard from './ItemCard';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';

class ItemsList extends React.Component {
    compare = (item1, item2) => {
        // If it's a decreasing criteria, swap the items
        if (this.criteria.charAt(0) === 'd') {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        // Sort by item description
        if (this.criteria.charAt(4) === 't') {
            if (item1.description < item2.description)
                return -1;
            else if (item1.description > item2.description)
                return 1;
            return 0;
        }
        // Sort by completed
        else if (this.criteria.charAt(4) === 'c') {
            if (item1.completed < item2.completed)
                return -1;
            else if (item1.completed > item2.completed)
                return 1;
            return 0;
        }
        // Sort by due date
        else {
            let date1 = item1.due_date;
            let date2 = item2.due_date;

            let year1 = parseInt(date1.substring(0, 4));
            let year2 = parseInt(date2.substring(0, 4));
            let month1 = parseInt(date1.substring(5, 7));
            let month2 = parseInt(date2.substring(5, 7));
            let day1 = parseInt(date1.substring(8, 10));
            let day2 = parseInt(date2.substring(8, 10));

            if (year1 < year2)
                return -1;
            else if (year1 > year2)
                return 1;
            else {
                if (month1 < month2)
                    return -1;
                else if (month1 > month2)
                    return 1;
                else {
                    if (day1 < day2)
                        return -1;
                    else if (day1 > day2)
                        return 1;
                    else
                        return 0;
                }
            }
        }
    }

    sortTasks = (criteria) => {
        let itemsArray = [...this.props.todoList.items];

        this.criteria = criteria;
        itemsArray.sort(this.compare);

        // Update the database
        const fireStore = getFirestore();
        fireStore.collection("todoLists").doc(this.props.todoList.id).update({
            items: itemsArray
        }).then(() => {
            console.log("Database updated with sorted items");
        });
    }

    sortItemsByTask = () => {
        // If we are currently increasing by task, switch to decreasing
        if (this.criteria === "inc_task")
            this.sortTasks("dec_task");
        // Otherwise, sort by increasing
        else
            this.sortTasks("inc_task");
    }

    sortItemsByCompleted = () => {
        // If we are currently increasing by completed, switch to decreasing
        if (this.criteria === "inc_comp")
            this.sortTasks("dec_comp");
        // Otherwise, sort by increasing
        else
            this.sortTasks("inc_comp");
    }

    sortItemsByDueDate = () => {
        // If we are currently increasing by due date, switch to decreasing
        if (this.criteria === "inc_date")
            this.sortTasks("dec_date");
        // Otherwise, sort by increasing
        else
            this.sortTasks("inc_date");
    }

    render() {
        const todoList = this.props.todoList;
        const items = todoList.items;

        return (
            <table className="todo-lists section striped">
                <thead>
                    <tr>
                        <th className="clickable" onClick={this.sortItemsByTask}>Description</th>
                        <th>Assigned To</th>
                        <th className="clickable" onClick={this.sortItemsByDueDate}>Due Date</th>
                        <th className="clickable" onClick={this.sortItemsByCompleted}>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {items && items.map(function(item) {
                        item.id = item.key;
                        return (
                            <ItemCard todoList={todoList} item={item} key={item.key}
                            first={items[0] === item ? true : false}
                            last={items[items.length - 1] === item ? true : false}
                            />
                        );})
                    }
                </tbody>
            </table>
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
)(ItemsList);