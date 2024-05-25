import { Routes, Route } from "react-router-dom";
import Home from "./home/homecreen";
import Room from "./home/room";
import ChatScreen from "./home/chatScreen";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rooms/:id" element={<Room />} />
      <Route path="/chat" element={<ChatScreen />} />
    </Routes>
  );
};

export default App;
