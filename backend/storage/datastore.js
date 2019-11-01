var DataStore = require("nedb");
var db = new DataStore({filename:"./backend/storage/db.dat",autoload:true});


module.exports.loadStoreData= function(){
    return new Promise((onSuccess, onError)=>{
        db.find({},(error, data)=>{
            if(error)
                onError(error);            
            onSuccess(data);
        });
    })   
}

module.exports.addTaskItem = (task)=>{
    return new Promise((onSuccess, onError)=>{
        db.insert(task, (err, newDoc)=>{
            if(err)
                onError(err);
            onSuccess(newDoc);
        });
    });
}

module.exports.deleteTaskItem = (toDelete)=>{
    return new Promise((onSuccess, onError)=>{
        db.remove(toDelete,{},(err, deleted)=>{
            if(err)
                onError(err);
            onSuccess(deleted, toDelete);
        });
    });
}

module.exports.updateTaskItem= (query, attrs)=>{
    return new Promise((onSuccess, onError)=>{
        db.update(query, {"$set":attrs}, {}, (err, updated)=>{
            if(err)
                onError(err)
            onSuccess(updated);
        });
    });
}

// export default db