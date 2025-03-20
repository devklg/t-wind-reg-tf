import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Notification from './Notification';

const Welcome = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [enrollment, setEnrollment] = useState(null);

    useEffect(() => {
        const fetchEnrollment = async () => {
            try {
                const data = await api.getEnrollment(id);
                setEnrollment(data);
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate('/');
                } else {
                    setNotification({
                        type: 'error',
                        message: 'Failed to load enrollment data'
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollment();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-700">Enrollment not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Talk Fusion!</h1>
                <p className="text-xl text-gray-600">Thank you for joining our community</p>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">Your Enrollment Details</h2>
                <div className="space-y-2">
                    <p><span className="font-medium">Enrollment ID:</span> {enrollment.enrollmentId}</p>
                    <p><span className="font-medium">Name:</span> {enrollment.firstName} {enrollment.lastName}</p>
                    <p><span className="font-medium">Package:</span> {enrollment.package}</p>
                    <p><span className="font-medium">Enrollment Date:</span> {new Date(enrollment.enrollmentDate).toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-purple-800 mb-4">Your Enroller Information</h2>
                <div className="space-y-2">
                    <p><span className="font-medium">Enroller Name:</span> {enrollment.sponsorName}</p>
                    <p>
                        <span className="font-medium">Enroller ID:</span>{' '}
                        {enrollment.sponsorId ? (
                            <span className="text-purple-700">{enrollment.sponsorId}</span>
                        ) : (
                            <span className="text-yellow-600 italic">Enroller not found in system</span>
                        )}
                    </p>
                </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-800 mb-4">Next Steps</h2>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                    <li>Review your enrollment details above</li>
                    <li>Check your email for additional information</li>
                    <li>Connect with your sponsor for guidance</li>
                    <li>Access your training materials</li>
                </ul>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={() => navigate(`/profile/${id}`)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    View Your Profile
                </button>
            </div>
        </div>
    );
};

export default Welcome; 