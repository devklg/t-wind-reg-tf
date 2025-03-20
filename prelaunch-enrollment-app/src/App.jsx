import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EnrollmentForm from './components/EnrollmentForm';
import ProfileForm from './components/ProfileForm';
import AdminDashboard from './components/AdminDashboard';
import Welcome from './components/Welcome';
import './styles/print.css';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Routes>
                    <Route path="/" element={<EnrollmentForm />} />
                    <Route path="/profile/:id" element={<ProfileForm />} />
                    <Route path="/welcome/:id" element={<Welcome />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
