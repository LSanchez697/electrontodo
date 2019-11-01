const {ipcRenderer} = require('electron')

ipcRenderer.on(CONST.SET_TASK_LIST, (e, taskList)=>{
    var fragment = document.createDocumentFragment(),
            container = document.querySelector("#cardscontainer");
    taskList.forEach((todoListItem, index)=>{
        var item = drawTaskListItem(todoListItem, index);
        fragment.append(item);
    });
    container.innerHTML = "";
    container.appendChild(fragment);

});

ipcRenderer.on(CONST.ADD_TASK_LIST_ITEM, (e, newTask)=>{
    var item = drawTaskListItem(newTask);
        document.querySelector("#cardscontainer").appendChild(item);              
})

ipcRenderer.on(CONST.REMOVE_TASK_LIST_ITEM, (e, toRemove)=>{
    var item = document.querySelector("#cardscontainer>div[data-index='"+toRemove+"']");            
    transition.begin(item,[
        "transform scale(1) scale(1,.1) .45s",
        "opacity 1 .5 .45s"
    ],{
        onTransitionEnd:()=>{ item.remove(); }
    });
})

ipcRenderer.on(CONST.UPDATE_TASK_LIST_ITEM, (e, updTask)=>{
    var nvoItem = drawTaskListItem(updTask),
        item = document.querySelector("#cardscontainer>div[data-index='"+updTask._id+"']");
    item.parentElement.replaceChild(nvoItem, item);
});       

ipcRenderer.on(CONST.ERROR, (e, args)=>{
   alert("ocurrió un error, es necesario revisar :v");
});

ipcRenderer.on(CONST.ADD_TODO_TASK_ITEM,(e, args)=>{
    var nvoTodo = drawTaskTodoItem(args.todo);
        document.querySelector("#listcontainer>ul").appendChild(nvoTodo);
})

ipcRenderer.on(CONST.REMOVE_TODO_TASK_ITEM, (e, args)=>{
    var element = document.querySelector(`#listcontainer>ul li[data-id='${args.key}']`);
    transition.begin(element,[
        "transform scale(1) scale(0) .45s"
    ],{
        onTransitionEnd:()=>{
            element.remove();                    
        }
    })
})

ipcRenderer.on(CONST.UPDATE_TODO_TASK_ITEM, (e, args)=>{
    var nvoTask = drawTaskTodoItem(args.todo),
    elmnt = document.querySelector(`#listcontainer>ul li[data-id='${args.key}']`);
    elmnt.parentElement.replaceChild(nvoTask, elmnt);
})


module.exports.ipcRenderer = ipcRenderer;