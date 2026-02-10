import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import CourseApproval from './pages/CourseApproval';
import Payments from './pages/Payments';
import TechCategories from './pages/TechCategories';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
    const admin = JSON.parse(localStorage.getItem('adminInfo') || 'null');
    if (!admin || admin.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="courses" element={<CourseApproval />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="categories" element={<TechCategories />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
