import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TalksList from './pages/TalksList';
import TalkDetail from './pages/TalkDetail';
import CreateTalk from './pages/CreateTalk';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';


export default function App(){
return (
<div className="app-root">
<Navbar />
<main className="container">
<Routes>
<Route path="/" element={<Home />} />
<Route path="/talks" element={<TalksList />} />
<Route path="/talks/:id" element={<TalkDetail />} />
<Route path="/create" element={<CreateTalk />} />
<Route path="/login" element={<Login />} />
<Route path="/admin/*" element={<AdminDashboard />} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes>
</main>
<footer className="site-footer">© {new Date().getFullYear()} CampusTalk</footer> 
</div>
);
}