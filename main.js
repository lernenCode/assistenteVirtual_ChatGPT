const path = require('path');
const {app, BrowserWindow, screen} = require("electron");

let janela;
const tamanhoJanela = {width: 500, height: 500,};

const abrirOuFecharJanela = (status) => {
  if(status == "mostrar"){
    janela.setSize(
      tamanhoJanela.width, 
      screen.getPrimaryDisplay().workAreaSize.height - 100
    );
    janela.setPosition(
      screen.getPrimaryDisplay().workAreaSize.width - tamanhoJanela.width,30
    );
  }else {
    janela.setSize(100,100);
    janela.setPosition(
    screen.getPrimaryDisplay().workArea.width - 80, 
    screen.getPrimaryDisplay().workArea.height - 100)
  }
}

const criarJanela = () => {
  janela = new BrowserWindow({
    width: tamanhoJanela.width, 
    height: screen.getPrimaryDisplay().workAreaSize.height, 
    x: screen.getPrimaryDisplay().workAreaSize.width - tamanhoJanela.width, 
    y: 30,
    alwaysOnTop: true,  
    transparent: true,  
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.resolve('./preload.js'),
    },
  });
};

const carregarOpenAi = () =>{
  janela.loadURL('https://chat.openai.com/chat')
}

const ocultarTudo = () =>{
  janela.webContents.executeJavaScript(`
    const elementoChat = document.querySelector('main');
    const copiaDoElemento = elementoChat.cloneNode(true);
    const elementoPaiDoChat = elementoChat.parentNode;
    
    elementoPaiDoChat.replaceChild(copiaDoElementoChat, elementoChat);
    documento.body.prepend(elementoChat);
    const elementosParaOcultar = documento.body.querySelectorAll('*');

    elementosParaOcultar.forEach(elemento) => {
      if(elemento.closet("main")){
          elemento.style.display = "none";
      }
    }};

    elementoChat.style.display = 'none';
  `);
};

const removerTodosBackground = () =>{
  janela.webContents.executeJavaScript(`
  const todosOsElementos = document.querySelectorAll("*");
  todosOsElementos.forEach(element => {
    element.style.background = 'transparent';
  });

  document.querySelector('textarea:first-of-type').style.background = "#fff";
  document.querySelector('textarea:first-of-type').style.color = "#000";
  document.querySelector('textarea:first-of-type').style.padding = "10px";
  `);
}

const adicionarAvatar = () =>{
  janela.webContents.executeJavaScript(`
  const avatar = document.createElement('img');
  avatar.id = 'avatar';
  avatar.src = 'https://media.tenor.com/f7BpnV-MUUEAAAAd/kot-kols.gif';
  document.body.prepend(avatar);
  `);
}

const aplicarNovosEstilos = () => {
  janela.webContents.insertCSS(`
    main{
      padding: 5px;
    }
    .bg-gray-50{
      --tw-bg-opacity: 1;
      background-color: rgba(0, 0, 0, 0.150);
      border-radius: 30px;
      margin: 5px;
    }
    .bg-gray-50 + div{
      --tw-bg-opacity: 1;
      background-color: rgba(0, 0, 0, 0.150);
      border-radius: 30px;
      margin: 5px;
    }

    img{
      height: 50px;
      widht: 100px;
      z-index: 1000;
      position: fixed;
      border-radius: 50%;
      right: 0px;
      filter: initial;
      clip-path: circle(30%);
      cursor: pointer;
    }
  `)
}

app.on("ready", () =>{
  criarJanela();
  abrirOuFecharJanela("ocultar");
  carregarOpenAi();

  janela.webContents.on("did-finish-load", () =>{
    ocultarTudo();
    removerTodosBackground();
    adicionarAvatar();
    aplicarNovosEstilos();
  });

  setTimeout(() => {
    janela.send("iniciar");
  }, 3000);
});