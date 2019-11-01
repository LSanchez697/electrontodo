(function(w, $){        
    let taskList,
        activeList,
        activeIndex,
        menuDisplay=false,
        menuSelected = 0;
    const
        STORAGE = "T0URD'4M0UR4V3CM0N4N4",
        {ipcRenderer} = require('./eventsHandler'),
        CONST = require('./backend/constants')


    //Eventos de la lista de pendientes
    function handleOnTaskMouseDown(evt){
        var taskItem = evt.target;
            taskItem.pressMenu = setTimeout(()=>{                            
                taskItem.longPress = true;                                 
                taskItem.classList.add("bg-red-200");
            },1500);
    }

    function handleOnTaskClick(item, evt){
        var element = evt.target;
        if((menuDisplay && evt.ctrlKey) || element.longPress){
            var isActive = element.classList.contains("active");
            if(element.longPress){
                delete element.longPress;
            }
            if(isActive){
                element.classList.remove("bg-red-200", "active")
                menuSelected--;
            }else{                                
                element.classList.add("bg-red-200", "active")
                menuSelected++;
            }                            
            menuDisplay = menuSelected>0;                
            toogleHiddenMenu();
            evt.stopPropagation();
            evt.preventDefault();
        }
    }

    function handleOnTaskTitleClick(evt){
        var elmnt = evt.target;
        evt.stopPropagation();
        if(elmnt.preclick){
            clearTimeout(elmnt.preclick);
            delete elmnt.preclick;
            return;
        }else if(!elmnt.hasAttribute("contentEditable")){
            elmnt.preclick = setTimeout(()=>{
                elmnt.actualTitle = elmnt.innerText.trim();
                elmnt.removeAttribute("contentEditable");
                delete elmnt.preclick;
            }, 650);
            elmnt.setAttribute("contentEditable",true);                                
        }
    }

    function handleOnTaskTitleBlur(item,elmnt){
        elmnt.removeAttribute("contentEditable");
        var name = (elmnt.innerText.trim() || "Vacio");
        elmnt.innerText = elmnt.actualTitle;
        ipcRenderer.send(CONST.UPDATE_TASK_LIST_ITEM,{
            attrs:{name},
            _id:item._id
        });
        delete elmnt.timeout
        delete elmnt.actualTitle;
    }

    function handleOnTaskTitleInput(evt){
        elmnt = evt.target;
        if(/<|>|\n|\s{2,}/gim.test(elmnt.innerText)){
            elmnt.innerText = elmnt.innerText.replace(/<|>|\n|\s{2,}/gim,"")                                    
        }else if(evt.keyCode == 13){
            elmnt.removeAttribute("contentEditable");
            elmnt.innerText = elmnt.innerText.trim();
        }
    }

    function handleOnTaskDetailsClick(item, evt){
        evt.stopPropagation();
        toogleViewTaskTodo();
        activeList = item;            
        document.querySelector("#taskListName").innerText = item.name;
        drawTaskTodos(item)
    }


    //eventos de todo individual
    function handleOnTodoClick(_key, evt){            
        var shanguiable = activeList.tasks.filter(item=> item._key == _key)[0]
            shanguiable.finished = !shanguiable.finished;
            ipcRenderer.send(CONST.UPDATE_TODO_TASK_ITEM,{
                _id:activeList._id,
                todo:shanguiable
            });
        // [index].finished = !activeList.tasks[index].finished;
        // ipcRenderer.send(CONST.UPDATE_TASK_LIST_ITEM,{
        //     attrs:{name},
        //     _id:item._id
        // });
        // todos[activeIndex] = activeList;
        // var element = evt.target;
        // updateTaskList(todos);
        // var nvo = drawTaskTodoItem(activeList.tasks[index], index),
            // liItem = element.parentElement.parentElement;
            // liItem.parentElement.replaceChild(nvo, liItem);
    }

    function handleOnTodoTrashClick(todo, evt){            
        evt.preventDefault();
        evt.stopPropagation();
        ipcRenderer.send(CONST.REMOVE_TODO_TASK_ITEM,{
            _id:activeList._id,
            todo
        });
        // var item = activeList.tasks[index];
        // var element = document.querySelector(`#listcontainer [data-id='${item._key}']`);
        // transition.begin(element,[
        //     "transform scale(1) scale(0) .45s"
        // ],{
        //     onTransitionEnd:()=>{
        //         element.remove();
        //         deleteTaskTodo(index);
        //     }
        // })

    }




    function loadTaskList() {
        ipcRenderer.send(CONST.READY);            
    }

    function toogleHiddenMenu(){
        var element = document.querySelector("#bottomMenu"),
            hasHidden = element.classList.contains("hidden");
        if(menuDisplay && hasHidden || !menuDisplay && !hasHidden){
            transition.begin(element,[
                "transform "+(menuDisplay? "scale(0) scale(1)":"scale(1) scale(0)")+" .45s",
                "opacity "+(menuDisplay? "0 1":"1 0")+" .45s"
            ],{
                onBeforeChangeStyle:(element)=>{
                    element.classList.toggle("hidden",!menuDisplay)
                }                
            });            
        }
    }

    function toogleViewTaskTodo(){
        var visible = document.querySelector(".container.control:not(.hidden)"),
            hidden = document.querySelector(".container.control.hidden");
        transition.begin(visible,[
            "opacity 1 0 .15s",                
            "transform scale(1) scale(0) .15s",                
        ],{onTransitionEnd:(elmnt)=>{
            elmnt.classList.add("hidden") 
            transition.begin(hidden,["opacity 0 1 .35s","transform scale(0) scale(1) .35s"],{
                onBeforeChangeStyle:(elmnt)=>{ elmnt.classList.remove("hidden") }
            })
        }});
    }



    //FUNCIONES TASK LIST
    function addTaskList(){
        ipcRenderer.send(CONST.ADD_TASK_LIST_ITEM);                    
    }

    function deleteTaskListItems(){
        if(menuSelected>0 && menuDisplay){
            document.querySelectorAll("#cardscontainer>div").forEach((item, index)=>{
                if(item.classList.contains('active')){
                    ipcRenderer.send(CONST.REMOVE_TASK_LIST_ITEM,{
                        _id:item.dataset.index,
                        index
                    });
                }
            });                
            menuSelected = 0;
            menuDisplay = false;
            toogleHiddenMenu();
        }
    }

    function updateTaskList(todos){
        w.localStorage.setItem(STORAGE, JSON.stringify(todos));            
    }


    
    //DIBUJO DE ELEMENTOS
    function drawTaskListFull(taskList) {
        var fragment = document.createDocumentFragment(),
            container = document.querySelector("#cardscontainer");
        taskList.forEach((todoListItem, index)=>{
            var item = drawTaskListItem(todoListItem, index);
            fragment.append(item);
        });
        container.innerHTML = "";
        container.appendChild(fragment);
    }      

    function drawTaskListItem(item) {
        return geDom.draw({
            tag:"div",
            attrs:{"data-index":`${item._id}`},
            class:"mb-2 flex flex-col sm:w-full md:w-2/4 rounded-sm bg-white shadow px-4 py-1",
            evt:[
                {trigger:"mousedown","action":handleOnTaskMouseDown},
                {trigger:"mouseup","action": evt =>clearTimeout(evt.target.pressMenu) },
                {trigger:"click", "action":evt=> handleOnTaskClick(item,evt)}
            ],
            content:[
                {tag:"span", class:"", content:(item.name || "Nueva Lista"),
                    evt:[
                        {trigger:"click","action":handleOnTaskTitleClick},
                        {trigger:"blur", "action":evt=>handleOnTaskTitleBlur(item, evt.target) },
                        {trigger:"input","action":evt=>handleOnTaskTitleInput(evt) }
                    ]                       
                },
                {tag:"a",attrs:{href:"#"},class:"self-end details",
                    content:{
                        tag:"span",attrs:{"data-icon":"dashicons:arrow-right"},class:"iconify text-lg"
                    },
                    evt:{trigger:"click", "action":evt=>{handleOnTaskDetailsClick(item, evt)} }
                }
            ]
        });
    }

    function drawTaskTodoItem(todo){
        return geDom.draw({
            tag:"li",
            attrs:{"data-id":todo._key},
            content:{
                tag:"label",
                class:`font-bold ${todo.finished && 'line-through text-teal-600'}`,
                content:{
                    tag:"div",
                    class:"flex flex-row items-center",
                    content:[
                        {tag:"input", 
                            class:`leading.tight mr-2`, 
                            attrs:{type:"checkbox", checked:todo.finished}, 
                            evt:{trigger:"click","action":evt => handleOnTodoClick(todo._key, evt)}
                        },
                        {tag:"span",class:'flex-shrink', content:todo.task},
                        {tag:"div",class:"inline-block ml-2 cursor-pointer",
                            evt:{ trigger:"click", action: evt => handleOnTodoTrashClick(todo, evt) },
                            content:{
                                tag:"span",
                                attrs:{
                                    "data-icon":"fa-solid:trash-alt",
                                    "data-inline":"false",
                                    "data-width":"10px",
                                    "data-height":"10px"
                                }, 
                                class:'iconify text-red-300 hover:text-red-500'
                            }
                        }
                    ]
                }
            }
        });
    }

    function drawTaskTodos(taskItem){
        var container = document.querySelector("#listcontainer"),
            list = document.createElement("ul"),
            frag = document.createDocumentFragment();
        list.classList.add("todos","list-inside","items-left");
        frag.appendChild(list);
        taskItem.tasks.forEach((todo, index)=>{              
            list.appendChild( drawTaskTodoItem(todo) )
        });            
        container.innerHTML = "";
        container.appendChild(frag);
    }
    
    // DRAW TODOS ADATA
   
    function addTaskTodo(task){            
        var todo = {
            "_key":(Math.random().toString(16).slice(-8)),
            "task":task,
            "stamp":(+new Date()),
            "finished":false
        }
        ipcRenderer.send(CONST.ADD_TODO_TASK_ITEM,{_id:activeList._id, todo});            
    }
   
    function deleteTaskTodo(index){
        activeList.tasks.splice(index, 1)
        todos[activeIndex] =  activeList;
        // updateTaskList(todos);
    }




    document.querySelector("#addTaskList").addEventListener("click",addTaskList);

    document.querySelector("#reloadPage").addEventListener("click", function(){
        w.location.reload();
    });

    document.querySelector("#inpuTodo").addEventListener("keydown",(evt)=>{
        var input = evt.target;
        if(evt.keyCode ===13 && input.value != ""){
            addTaskTodo(input.value);
            input.value = "";
        }
    });
 
    document.querySelector("#inpuTodo").addEventListener("input", (evt)=>{
        document.querySelector("#msjleng").innerText = evt.target.value.length;
    });

    document.querySelector("#btnAdd").addEventListener("click", function(evt){
        var input = this.previousElementSibling.previousElementSibling.querySelector("input"),
            todo = input.value;
        addTaskTodo(todo);
        input.value = "";
    });
    
    document.querySelector("body").addEventListener("click",function(evt){
        if(menuDisplay && !evt.ctrlKey){
            this.querySelectorAll("#cardscontainer>div.bg-red-200").forEach((item)=>{
                item.classList.remove("bg-red-200","active");
                var vid = item.dataset.index;
                todos[vid].selected = false;
                menuDisplay = false;
            });
            // updateTaskList(todos);
            menuSelected = 0;
            toogleHiddenMenu();
        }
    })
    
    document.querySelector("#goBackList").addEventListener("click",function(){
        activeList = null;
        activeIndex = null;
        toogleViewTaskTodo();
    })
    
    document.querySelector("#btnDltItems").addEventListener("click",function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        (!activeList && deleteTaskListItems() ) || (activeList && deleteTaskTodo());
        
    })
    
    loadTaskList();
})( self, require("jquery"))