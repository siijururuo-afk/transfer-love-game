import React from 'react';
import{createRoot}from'react-dom/client';
import{FoundPhone}from'./phone';
import'./phone.css';
import'./music.css';
import'./youtube.css';
import'./surfaces.css';
createRoot(document.getElementById('root')!).render(<React.StrictMode><FoundPhone/></React.StrictMode>);
