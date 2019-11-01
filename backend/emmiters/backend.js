const {ipcMain} = require('electron')
const actions = require('../actions')
const CONST = require('../constants')

ipcMain.on(CONST.READY, (evt, args)=>{
    actions.readTodoList()
        .then((data)=>{
            actions.setTodoList(data);
            evt.sender.send(CONST.SET_TASK_LIST, data);
        })
        .catch((err)=>{  
            evt.sender.send(CONST.ERROR,{
                message:"Falló la lectura de datos :(",
                err
            });
        });
})

ipcMain.on(CONST.ADD_TASK_LIST_ITEM,(evt)=>{
    actions.prepareInsert()
        .then(newTask=>{
            actions.addTaskIten(newTask)
            evt.sender.send(CONST.ADD_TASK_LIST_ITEM, newTask);
        })
        .catch(err=>{
            evt.sender.send(CONST.ERROR,{
                message:"Falló la lectura de datos :(",
                err
            });
        });
});

ipcMain.on(CONST.REMOVE_TASK_LIST_ITEM, (evt, args)=>{
    actions.prepareDeleteTaskItem(args)
        .then(function(deleted){
            if(!deleted){
                throw {deleted};
            }
            actions.removeTaskItem(args.index);
            evt.sender.send(CONST.REMOVE_TASK_LIST_ITEM,args._id);
        })
        .catch((err)=>{
            evt.sender.send(CONST.ERROR,{
                message:"Falló la eliminación de cosas",
                err
            });
        })
})

ipcMain.on(CONST.UPDATE_TASK_LIST_ITEM, (evt, args)=>{
    var {_id, attrs}  = args;
    actions.prepareUpdateTask({_id}, attrs)
        .then(function(updated){
            if(!updated){ throw updated }
            actions.updateTaskList(_id, attrs);
            evt.sender.send( CONST.UPDATE_TASK_LIST_ITEM, actions.getItem(_id) );
        })
        .catch(()=>{
            evt.sender.send(CONST.ERROR,{
                message:"Falló la actualización del registro",
                err
            });
        });
});

ipcMain.on(CONST.ADD_TODO_TASK_ITEM, (evt, args)=>{
    var {_id, todo} = args;
    var item = actions.getItem(_id);
    if(item){
        tasks = item.tasks.concat([todo]);
        actions.prepareUpdateTask({_id},{tasks})        
            .then(function(updated){
                if(!updated){
                    throw updated
                }
                actions.updateTaskList(_id,{tasks})
                evt.sender.send(CONST.ADD_TODO_TASK_ITEM,{todo});
            })
            .catch((err)=>{
                evt.sender.send(CONST.ERROR,{
                    message:"Ocurrió un error al intentar guardar la tarea",
                    err
                });
            });
    }        
        
})

ipcMain.on(CONST.UPDATE_TODO_TASK_ITEM,(evt, args)=>{
    var {_id, todo} = args,
        item = actions.getItem(_id);
    if(item){
        tasks = item.tasks.map(( task )=>{ return task._key != todo._key? task:todo;   })
        actions.prepareUpdateTask({_id},{tasks})        
            .then(function(updated){
                if(!updated){
                    throw updated
                }
                actions.updateTaskList(_id,{tasks})
                evt.sender.send(CONST.UPDATE_TODO_TASK_ITEM,{key:todo._key, todo});
            })
            .catch((err)=>{
                evt.sender.send(CONST.ERROR,{
                    message:"Ocurrió un error al intentar guardar la tarea",
                    err
                });
            });
    }
})

ipcMain.on(CONST.REMOVE_TODO_TASK_ITEM, (evt, args)=>{
    var {_id, todo} = args,
        item = actions.getItem(_id);
    if(item){
        tasks = item.tasks.filter(( task )=>{ return task._key != todo._key; })
        actions.prepareUpdateTask({_id},{tasks})        
            .then(function(updated){
                if(!updated){
                    throw updated
                }
                actions.updateTaskList(_id,{tasks})
                evt.sender.send(CONST.REMOVE_TODO_TASK_ITEM,{ key:todo._key });
            })
            .catch((err)=>{
                evt.sender.send(CONST.ERROR,{
                    message:"Ocurrió un error al intentar guardar la tarea",
                    err
                });
            });
    }
})

