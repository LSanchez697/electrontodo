const {app, BrowserWindow} = require("electron")
const url = require("url")
const path  = require("path")
require('./backend/emmiters/backend');
let win 

const createWindow = ()=>{   

    win = new BrowserWindow({
        width:380, 
        height:620,        
        fullscreenable:false,
        resizable:false,
        title:"Todo Swi",        
        webPreferences:{
            nodeIntegration:true
        }
    });
   
    win.setMenuBarVisibility(false);    
   
    win.loadURL(url.format({
        pathname:path.join(__dirname,"index.html"),
        protocol:"file",
        slashes:1
    }));    
    
    win.on("close",()=>{
        win = null;
    });
    
    // win.webContents.openDevTools()
    
}

app.on("window-all-closed",()=>{
    if(process.platform != "darwin"){
        app.quit();
    }
})

app.on("activate",()=>{
    if(win === null){
        win = createWindow();
    }
})

app.on("ready", createWindow);