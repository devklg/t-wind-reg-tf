import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EnrollmentForm from './components/EnrollmentForm';
import Welcome from './components/Welcome';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import TestEnrollments from './components/TestEnrollments';
import DownlineList from './components/DownlineList';
import './styles/print.css';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <Routes>
                    <Route path="/" element={<EnrollmentForm />} />
                    <Route path="/welcome/:id" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/test-enrollments" element={<TestEnrollments />} />

                    {/* Admin routes */}
                    <Route
                        path="/admin/*"
                        element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        }
                    />

                    {/* User profile routes */}
                    <Route
                        path="/profile/:id"
                        element={
                            <PrivateRoute>
                                <Profile />
                            </PrivateRoute>
                        }
                    />

                    {/* Redirect /enrollments/:id to /profile/:id */}
                    <Route
                        path="/enrollments/:id"
                        element={<Navigate to={location => {
                            const id = location.pathname.split('/').pop();
                            console.log('Redirecting from enrollments to profile with ID:', id);
                            return `/profile/${id}`;
                        }} replace />}
                    />

                    {/* Add DownlineList route */}
                    <Route
                        path="/downline"
                        element={
                            <PrivateRoute>
                                <DownlineList />
                            </PrivateRoute>
                        }
                    />

                    {/* Catch all route */}
                    <Route
                        path="*"
                        element={
                            <div className="min-h-screen flex items-center justify-center">
                                <div className="text-center">
                                    <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                                    <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
