import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/Register";
import Announcements from "./pages/Announcements";
import CreateAnnouncement from "./pages/CreateAnnouncement";
import EditAnnouncement from "./pages/EditAnnouncement";
import { UserProvider } from "./Context";

const App: React.FC = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/create" element={<CreateAnnouncement />} />
        <Route path="/edit/:id" element={<EditAnnouncement />} />
      </Routes>
    </UserProvider>
  );
};

export default App;
