import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Notification from './Notification';

const ProfileForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        paymentMethod: '',
    });

    useEffect(() => {
        const fetchEnrollment = async () => {
            try {
                setLoading(true);
                const data = await api.getEnrollment(id);
                setEnrollment(data);
                setFormData(prev => ({
                    ...prev,
                    phone: data.phone || '',
                    address: data.address || '',
                    city: data.city || '',
                    state: data.state || '',
                    zipCode: data.zipCode || '',
                    country: data.country || '',
                    paymentMethod: data.paymentMethod || '',
                }));
            } catch (error) {
                if (error.response?.status === 401) {
                    // If unauthorized, redirect to login
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.updateEnrollment(id, formData);
            setNotification({
                type: 'success',
                message: 'Profile updated successfully! Redirecting to welcome page...'
            });
            // Wait for 2 seconds to show the success message
            setTimeout(() => {
                navigate(`/welcome/${id}`);
            }, 2000);
        } catch (error) {
            if (error.response?.status === 401) {
                // If unauthorized, redirect to login
                navigate('/');
            } else {
                setNotification({
                    type: 'error',
                    message: 'Failed to update profile'
                });
            }
        } finally {
            setSaving(false);
        }
    };

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
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Complete Your Profile</h2>
                <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">Your Enrollment ID: <span className="font-semibold">{enrollment.enrollmentId}</span></p>
                    <p className="text-sm text-gray-600">Enrollment Date: <span className="font-semibold">{new Date(enrollment.enrollmentDate).toLocaleString()}</span></p>
                </div>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Select payment method</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileForm; 