import Login from "./pages/login.tsx";
import Register from "./pages/register.tsx";
import Announcements from "./pages/announcements.tsx";
import CreateAnnouncement from "./pages/createAnnouncement.tsx";
import EditAnnouncement from "./pages/editAnnouncement.tsx";
import router from "../../Back/routes/userRoutes.js";
function App() {
  return (
    
      <Login />
      <Register />
      <Announcements />
      <CreateAnnouncement />
      <EditAnnouncement />
  );
}

export default App;
