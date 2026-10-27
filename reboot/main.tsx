import React from 'react';
import{createRoot}from'react-dom/client';
import{FoundPhone}from'./phone';
import'./phone.css';
import'./music.css';
import'./youtube.css';
import'./surfaces.css';
import'./redesign.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><FoundPhone/></React.StrictMode>);

if(location.hostname!=='localhost'&&location.hostname!=='127.0.0.1'&&'serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js',{scope:'./'}).then(reg=>{void reg.update().catch(()=>{})}).catch(()=>{})})}
