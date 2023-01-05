const { ipcRenderer } = require('electron');
ipcRenderer.on("iniciar", (event,arg) => {
    const elementoAvatar = document.querySelector("#avatar");
    const elementMain = document.querySelector('main');

    elementoAvatar.onclick = () =>{
        if(elementMain.style.display == "none"){
            ipcRenderer.send("abrirOuFecharJanela", "mostrar");
            elementMain.style.backgroundColor = "#171717";
            elementMain.style.display = "";
        }else{
            ipcRenderer.send("abrirOuFecharJanela", "ocultar")
            elementMain.style.display = "none";
            elementMain.style.backgroundColor = "";
        }
    }
})