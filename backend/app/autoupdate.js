// const { autoUpdater } = require('electron');
const {APP_UPDATE_AVALIABLE, APP_UPDATE_DOWNLOADED} = require("../constants")

module.exports.startUpdatesChecker = function(webcontents){
    // console.log("inicia el chequeo de actualizaciones", APP_UPDATE_AVALIABLE)
    // autoUpdater.
    // autoUpdater.setFeedURL("")
    // autoUpdater.checkForUpdatesAndNotify(); 

    //  autoUpdater.on("update-available", ()=>{
    //      console.log("hay una disponible")
    //     //  webcontents.send(APP_UPDATE_AVALIABLE)
    // })

    // autoUpdater.on('update-downloaded', ()=>{
    //     webcontents.send(APP_UPDATE_DOWNLOADED)
    // });
}