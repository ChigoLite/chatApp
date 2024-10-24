import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import UserProfile from "./home/Profile";
import Loading from "./loader/Loading";
import VideoCall from "./p2p/videoCall";
import AnswerCall from "./p2p/answerCall";
const ChatScreen = lazy(() => import("./home/chatScreen"));
const Home = lazy(() => import("./home/homecreen"));
const Login = lazy(() => import("./signup/signPage"));
const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<ChatScreen />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/chat" element={<ChatScreen />} /> */}
        <Route path="/profile/:id" element={<UserProfile />} />
        <Route path="/profile/call" element={<VideoCall />}/>
      </Routes>
    </Suspense>
  );
};

export default App;
