import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import Dashboard from './Dashboard';
import BrowseCourses from './BrowseCourses';
import ProfilePage from './ProfilePage';
import ResumeBuilder from './ResumeBuilder';
import MentorsPage from './MentorsPage';
import ChatPage from './ChatPage';
import CreateCoursePage from './CreateCoursePage';
import CourseDetailsPage from './CourseDetailsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<BrowseCourses />} />
        <Route path="/courses/:id" element={<CourseDetailsPage />} />
        <Route path="/create-course" element={<CreateCoursePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/resume" element={<ResumeBuilder />} />
        <Route path="/mentors" element={<MentorsPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
