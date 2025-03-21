import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const TestEnrollments = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const generateTestData = () => {
        const packages = ['Entry Pack', 'Elite Pack', 'Pro Pack'];
        const firstNames = ['James', 'Emma', 'Michael', 'Sophia', 'William'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
        const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
        const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
        const domains = ['gmail.com', 'yahoo.com', 'outlook.com'];
        const sponsorName = localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName
            : 'Admin User';

        const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

        return Array.from({ length: 5 }, (_, index) => ({
            firstName: firstNames[index],
            lastName: lastNames[index],
            email: `${firstNames[index].toLowerCase()}.${lastNames[index].toLowerCase()}@${getRandomItem(domains)}`,
            phone: `555-${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            address: `${Math.floor(Math.random() * 9000) + 1000} ${getRandomItem(['Main', 'Oak', 'Maple', 'Cedar', 'Pine'])} Street`,
            city: cities[index],
            state: states[index],
            zipCode: String(Math.floor(Math.random() * 90000) + 10000),
            country: 'United States',
            package: getRandomItem(packages),
            sponsorName: sponsorName
        }));
    };

    const createEnrollments = async () => {
        setLoading(true);
        const testData = generateTestData();
        const results = [];

        try {
            for (const enrollmentData of testData) {
                try {
                    console.log('Creating enrollment:', enrollmentData);
                    const response = await apiService.createEnrollment(enrollmentData);
                    console.log('Enrollment created:', response.data);

                    results.push({
                        success: true,
                        data: response.data,
                        email: enrollmentData.email,
                        name: `${enrollmentData.firstName} ${enrollmentData.lastName}`
                    });

                    toast.success(`Created enrollment for ${enrollmentData.firstName} ${enrollmentData.lastName}`, {
                        position: 'top-center',
                        autoClose: 2000
                    });
                } catch (error) {
                    console.error('Error creating enrollment:', error);
                    results.push({
                        success: false,
                        error: error.message,
                        email: enrollmentData.email,
                        name: `${enrollmentData.firstName} ${enrollmentData.lastName}`
                    });

                    toast.error(`Failed to create enrollment for ${enrollmentData.firstName} ${enrollmentData.lastName}`, {
                        position: 'top-center',
                        autoClose: 3000
                    });
                }
                // Add a small delay between requests to prevent overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } finally {
            setLoading(false);
            setResults(results);

            if (results.some(r => r.success)) {
                toast.info('View your downline to see the new enrollees', {
                    position: 'top-center',
                    autoClose: 5000
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Test Enrollments Generator</h2>
                        <div className="flex space-x-4">
                            <button
                                onClick={createEnrollments}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Creating Enrollments...' : 'Create 5 Test Enrollments'}
                            </button>
                            <button
                                onClick={() => navigate('/downline')}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                View Downline List
                            </button>
                        </div>
                    </div>

                    {results.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-4">Results</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {results.map((result, index) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${result.success
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {result.success ? 'Success' : 'Failed'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {result.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {result.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {result.success
                                                        ? `ID: ${result.data?.user?.id || result.data?.id}`
                                                        : `Error: ${result.error}`
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestEnrollments; 