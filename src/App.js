import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UploadPhoto from "./pages/UploadPhoto";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import CreateCampaign from "./pages/CreateCampaign";
import CreateSelection from "./pages/CreateSelection";
import AddRequest from "./pages/AddRequest";
import Community from "./pages/Community";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import RequestDetail from "./pages/RequestDetail"; // Added
import Splash from "./pages/Splash";
import BottomNav from "./components/BottomNav";

export default function App() {
  const location = useLocation();
  const hideNavRoutes = ['/', '/login', '/signup', '/upload-photo'];
  const showNav = !hideNavRoutes.includes(location.pathname) && !location.pathname.startsWith('/community/post/');

  return (
    <div className="app">
      <main className="main">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload-photo" element={<UploadPhoto />} />
          <Route path="/home" element={<Home />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/create" element={<CreateSelection />} />
          <Route path="/create/campaign" element={<CreateCampaign />} />
          <Route path="/create/request" element={<AddRequest />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
          <Route path="/campaigns/edit/:id" element={<CreateCampaign />} />
          <Route path="/requests/edit/:id" element={<AddRequest />} /> {/* Added */}
          <Route path="/community" element={<Community />} />
          <Route path="/community/post/:id" element={<PostDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/explore" element={<Campaigns />} />
        </Routes>
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
