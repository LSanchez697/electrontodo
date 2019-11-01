var CONST = require('../constants/');
var {store} = require("../stores/");
const datastore = require("../storage/datastore")

module.exports.readTodoList = ()=>{
    return datastore.loadStoreData()
}

module.exports.prepareInsert = ()=>{
    var newTask = {
        "name":"Nuevo Item",
        "completed":false,
        "active":true,
        "tasks":[]
    };
    return datastore.addTaskItem(newTask)      
}

module.exports.prepareDeleteTaskItem = (task)=>{
    var {_id} = task;
    return datastore.deleteTaskItem({_id})
}

module.exports.findStoreItem = (_id)=>{
    var ret;
    store.getState().forEach(function(item, index){
        if(item._id == _id){
            ret = {index, item};
        }
    });
    return ret;
}

module.exports.getItem = (id)=>{
    return store.getState().filter((v)=>{ return v._id == id })[0];
}

module.exports.prepareUpdateTask = (query , data)=>{
    return datastore.updateTaskItem(query, data);
}

module.exports.updateTaskList =(_id, data)=>{
    store.dispatch({
        type:CONST.UPDATE_TASK_LIST_ITEM,
        payload:{
            _id, 
            data
        }
    });
}


module.exports.setTodoList = (todos)=>{    
    store.dispatch({
        type:CONST.SET_TASK_LIST,
        payload:todos
    });    
}

module.exports.addTaskIten = (payload)=>{
    store.dispatch({
        type:CONST.ADD_TASK_LIST_ITEM,
        payload
    });
}


module.exports.removeTaskItem = (index)=>{
    store.dispatch({
        type:CONST.REMOVE_TASK_LIST_ITEM,
        payload:{ index }
    });
}
