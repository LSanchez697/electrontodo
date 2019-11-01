var CONST = require('../constants');
var {createStore} = require('redux');

const removeItemState = (toDelete)=>{
    var isArray = Array.isArray(toDelete);
    return function(task, index){
        return (isArray? toDelete.indexOf(index)<0:index != toDelete);
    }
}

const mergeObject= (original, spread)=>{
    return Object.assign({}, original, spread);
}

const reducer = (state=[], action)=>{    
    switch (action.type){
        case CONST.SET_TASK_LIST:
            return action.payload;
        case CONST.ADD_TASK_LIST_ITEM:
            return state.concat(action.payload);

        case CONST.REMOVE_TASK_LIST_ITEM:
            return state.filter(removeItemState(action.payload.index));

        case CONST.UPDATE_TASK_LIST_ITEM:
            return state.map((task)=>{
                return task._id != action.payload._id? task:mergeObject(task, action.payload.data);
            });
            
        default:
            return state;     
    }
}

const store = createStore(reducer, []);
module.exports.store = store;
// module.exports.reducer = reducer;