import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { toast } from 'react-toastify';
import Notification from './Notification';

const EnrollmentForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        sponsorName: '',
        package: ''
    });
    const [error, setError] = useState(null);

    const packages = [
        {
            id: 'Entry Pack',
            name: 'Entry Pack',
            price: '$175',
            description: 'Perfect for getting started with Talk Fusion',
            features: [
                'Basic business tools',
                '100 Personal Volume (PV)',
                '$50 Fast Start Bonus',
                'Essential training materials'
            ]
        },
        {
            id: 'Elite Pack',
            name: 'Elite Pack',
            price: '$350',
            description: 'Enhanced package for serious entrepreneurs',
            features: [
                'Advanced business tools',
                '200 Personal Volume (PV)',
                '$100 Fast Start Bonus',
                'Premium training materials',
                'Priority support'
            ]
        },
        {
            id: 'Pro Pack',
            name: 'Pro Pack',
            price: '$700',
            description: 'Complete package for professional success',
            features: [
                'Full suite of business tools',
                '400 Personal Volume (PV)',
                '$200 Fast Start Bonus',
                'VIP training materials',
                '24/7 priority support',
                'Exclusive marketing resources'
            ]
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePackageSelect = (packageId) => {
        setFormData(prev => ({
            ...prev,
            package: packageId
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Creating enrollment with data:', formData);
            const response = await api.createEnrollment(formData);
            console.log('Enrollment creation response:', response);

            if (!response || !response.data) {
                throw new Error('Invalid response from server');
            }

            const { token, enrollment, temporaryPassword } = response.data;

            // Store auth data
            localStorage.setItem('token', token);
            localStorage.setItem('userRole', enrollment.role || 'user');
            localStorage.setItem('userId', enrollment._id);
            localStorage.setItem('user', JSON.stringify({
                id: enrollment._id,
                email: enrollment.email,
                firstName: enrollment.firstName,
                lastName: enrollment.lastName,
                role: enrollment.role || 'user'
            }));

            // Show success message with temporary password
            toast.success(`Enrollment successful! Your temporary password is: ${temporaryPassword}`, {
                position: 'top-center',
                autoClose: 5000
            });

            // Wait for toast to show before redirecting
            setTimeout(() => {
                navigate(`/profile/${enrollment._id}`);
            }, 5000);

        } catch (error) {
            console.error('Enrollment creation error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create enrollment';
            toast.error(errorMessage, {
                position: 'top-center',
                autoClose: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Join Talk Fusion</h2>

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
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Sponsor Name</label>
                    <input
                        type="text"
                        name="sponsorName"
                        value={formData.sponsorName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Select Your Package</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {packages.map((pkg) => (
                            <div
                                key={pkg.id}
                                onClick={() => handlePackageSelect(pkg.id)}
                                className={`cursor-pointer rounded-lg border-2 p-6 transition-all duration-200 ${formData.package === pkg.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                                <p className="text-2xl font-bold text-blue-600 mt-2">{pkg.price}</p>
                                <p className="text-gray-600 mt-2">{pkg.description}</p>
                                <ul className="mt-4 space-y-2">
                                    {pkg.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {!formData.package && (
                        <p className="mt-2 text-sm text-red-600">Please select a package to continue</p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !formData.package}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Join Now'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EnrollmentForm; 