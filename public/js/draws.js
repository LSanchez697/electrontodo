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