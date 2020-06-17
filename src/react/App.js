import React, { useEffect, useState } from 'react';
import { HashRouter, Route, NavLink } from 'react-router-dom'
import './App.css';
import { channels } from '../shared/constants'
import Main from './components/main';
import GetCustom from './components/getcustom';
const { ipcRenderer } = window;

function App() {

  const [name, setName] = useState("")
  const [version, setVersion] = useState("")
  const [activeTab, setActiveTab] = useState("")

  useEffect(() => {
    ipcRenderer.send(channels.APP_INFO);
    ipcRenderer.on(channels.APP_INFO, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.APP_INFO);
      const { appName, appVersion } = arg;
      setName(appName)
      setVersion(appVersion)
    });
    const [_, path] = window.location.hash.split('/')
    console.log(_, path)
    setActiveTab(path)
  }, [])



  return (
    <div className="App">
      <header className="App-header">
        <p>{name}</p>{" "}
        <button>v{version}</button>
      </header>
      {console.log(activeTab)}
      <HashRouter>
        <>
          <div className="App-Router">
            <p ><NavLink exact to="/" activeClassName="active" >Predefined List</NavLink></p>
            <p ><NavLink exact to="/getcustom" activeClassName="active">Custom Download</NavLink></p>
          </div>
          <Route path="/" exact component={Main} />
          <Route path="/getcustom" exact component={GetCustom} />
        </>
      </HashRouter>

    </div>
  );

}

export default App;
