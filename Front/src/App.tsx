import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login"; // Assurez-vous que le nom correspond
import Register from "./pages/Register"; // Assurez-vous que le nom correspond
import Announcements from "./pages/Announcements"; // Assurez-vous que le nom correspond
import CreateAnnouncement from "./pages/CreateAnnouncement"; // Assurez-vous que le nom correspond
import EditAnnouncement from "./pages/EditAnnouncement"; // Assurez-vous que le nom correspond

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/create" element={<CreateAnnouncement />} />
      <Route path="/edit/:id" element={<EditAnnouncement />} />
    </Routes>
  );
};

export default App;
