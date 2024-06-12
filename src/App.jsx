import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
const ChatScreen = lazy(() => import("./home/chatScreen"));
const Home = lazy(() => import("./home/homecreen"));
const App = () => {
  return (
    <Suspense fallback="Loading....">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </Suspense>
  );
};

export default App;
