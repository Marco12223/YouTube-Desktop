const {app, BrowserWindow, session, Menu} = require('electron')
const path = require('path')
const express = require('express')
const request = require('request-promise');
const cheerio = require('cheerio');
const DiscordRPC = require('discord-rpc');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();
const clientId = '683530788909613258';

let win;

DiscordRPC.register(clientId);

const createWindow = () =>{
  var ex = express();
  ex.listen(3400);
  Menu.setApplicationMenu(false)
  win = new BrowserWindow({
      center: true,
      resizable: true,
      icon: "favicon.png",
      title: "YouTube",
      darkTheme: true,
      frame: true,
      titleBarStyle: false,
      webPreferences:{
          nodeIntegration: false,
          show: false
      }
  });

  session

  .fromPartition('some-partition')

  .setPermissionRequestHandler((webContents, permission, callback) => {

    const url = webContents.getURL()

    if (permission === 'notifications') {
      
      callback(true)

    }

  })

  try {

    setInterval(function() {

      console.log(win.webContents.getURL());

      (async () => {

        if(win.webContents.getURL().startsWith("https://www.youtube.com/watch?v=")) {

          let url = win.webContents.getURL();
    
          let response = await request(url);
      
          let $ = cheerio.load(response);
      
          let getTitle = $('span#eow-title').text();

          rpc.setActivity({
            details: "Schaut YouTube",
            state: 'Schaut ' + getTitle,
            startTimestamp: null,
            largeImageKey: 'logo',
            largeImageText: 'YouTube Desktop',
            smallImageKey: 'playbutton',
            smallImageText: 'Schaut: ' + getTitle,
            instance: false,
          });
        
          rpc.login({ clientId }).catch(console.error);
  
      } else if(win.webContents.getURL() == "https://www.youtube.com/") {

        rpc.setActivity({
          details: "Ist auf der YouTube Homepage",
          state: 'Schaut derzeitig nix',
          largeImageKey: 'logo',
          largeImageText: 'YouTube Desktop',
          smallImageKey: 'site',
          smallImageText: 'Schaut: Nix',
          instance: false,
        });
      
        rpc.login({ clientId }).catch(console.error);
  
      } else if(win.webContents.getURL().startsWith("https://www.youtube.com/channel/") || win.webContents.getURL().startsWith("https://www.youtube.com/channel/")) {

        rpc.setActivity({
          details: "Ist grade auf ein Channel unterwegs!",
          state: 'Schaut derzeitig nix',
          largeImageKey: 'logo',
          largeImageText: 'YouTube Desktop',
          smallImageKey: 'site',
          smallImageText: 'Schaut: Nix',
          instance: false,
        });
      
        rpc.login({ clientId }).catch(console.error);

      } else if(win.webContents.getURL() == "https://www.youtube.com/upload") {

        rpc.setActivity({
          details: "Läd grade ein Video hoch!",
          state: 'Schaut derzeitig nix',
          largeImageKey: 'logo',
          largeImageText: 'YouTube Desktop',
          smallImageKey: 'site',
          smallImageText: 'Schaut: Nix',
          instance: false,
        });
      
        rpc.login({ clientId }).catch(console.error);

      }
    
    })();
  
    }, 15e3)  
    
  } catch (error) {
    
  }

  win.loadURL('https://www.youtube.com/', {userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.26 Safari/537.36 Edg/81.0.416.16'})

}

app.on('ready', createWindow);