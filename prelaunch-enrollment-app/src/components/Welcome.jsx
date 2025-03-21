import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const Welcome = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [enrollment, setEnrollment] = useState(null);

    useEffect(() => {
        const fetchEnrollment = async () => {
            try {
                const data = await apiService.getEnrollment(id);
                setEnrollment(data);
            } catch (error) {
                console.error('Error fetching enrollment:', error);
                if (error.response?.status === 401) {
                    // If unauthorized, redirect to login
                    navigate('/login');
                } else {
                    toast.error('Failed to load enrollment details');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollment();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Enrollment not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Welcome to Your Enrollment!</h2>

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrollment Details</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Enrollment ID</p>
                                    <p className="mt-1 text-sm text-gray-900">{enrollment.enrollmentId}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Name</p>
                                    <p className="mt-1 text-sm text-gray-900">{`${enrollment.firstName} ${enrollment.lastName}`}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Package</p>
                                    <p className="mt-1 text-sm text-gray-900">{enrollment.package}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Enrollment Date</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sponsor Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Sponsor Name</p>
                                    <p className="mt-1 text-sm text-gray-900">{enrollment.sponsorName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Sponsor ID</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {enrollment.sponsorId || 'Not available'}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Thank you for enrolling! Here are your next steps:
                                </p>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                    <li>Complete your profile information</li>
                                    <li>Review your package benefits</li>
                                    <li>Set up your payment method</li>
                                    <li>Start your training program</li>
                                </ol>
                            </div>
                        </section>

                        <div className="flex justify-end">
                            <button
                                onClick={() => navigate(`/profile/${id}`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Go to Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome; 