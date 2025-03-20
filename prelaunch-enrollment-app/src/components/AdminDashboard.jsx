import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import PrintEnrollment from './PrintEnrollment';
import Notification from './Notification';

const AdminDashboard = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [selectedEnrollment, setSelectedEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showPrintPreview, setShowPrintPreview] = useState(false);
    const [printMode, setPrintMode] = useState('list');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        sponsorName: '',
        package: '',
    });

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const data = await api.getEnrollments();
            setEnrollments(data);
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Failed to fetch enrollments'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = (mode, enrollment = null) => {
        setPrintMode(mode);
        if (mode === 'individual' && enrollment) {
            setSelectedEnrollment(enrollment);
        }
        setShowPrintPreview(true);
    };

    const handlePrintConfirm = () => {
        window.print();
    };

    const handlePrintCancel = () => {
        setShowPrintPreview(false);
        setSelectedEnrollment(null);
    };

    const handleCreate = () => {
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            sponsorName: '',
            package: '',
        });
        setShowCreateModal(true);
    };

    const handleEdit = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setFormData({
            firstName: enrollment.firstName,
            lastName: enrollment.lastName,
            email: enrollment.email,
            sponsorName: enrollment.sponsorName,
            package: enrollment.package,
        });
        setShowEditModal(true);
    };

    const handleDelete = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setShowDeleteModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createEnrollment(formData);
            setNotification({
                type: 'success',
                message: 'Enrollment created successfully'
            });
            setShowCreateModal(false);
            fetchEnrollments();
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Failed to create enrollment'
            });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.updateEnrollment(selectedEnrollment._id, formData);
            setNotification({
                type: 'success',
                message: 'Enrollment updated successfully'
            });
            setShowEditModal(false);
            fetchEnrollments();
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Failed to update enrollment'
            });
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.deleteEnrollment(selectedEnrollment._id);
            setNotification({
                type: 'success',
                message: 'Enrollment deleted successfully'
            });
            setShowDeleteModal(false);
            fetchEnrollments();
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Failed to delete enrollment'
            });
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <div className="space-x-4">
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Create New Enrollment
                    </button>
                    <button
                        onClick={() => handlePrint('list')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Print All Enrollments
                    </button>
                </div>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {enrollments.map((enrollment) => (
                            <tr key={enrollment._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {enrollment.firstName} {enrollment.lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{enrollment.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{enrollment.package}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${enrollment.status === 'Active' ? 'bg-green-100 text-green-800' :
                                        enrollment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {enrollment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(enrollment)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(enrollment)}
                                        className="text-red-600 hover:text-red-900 mr-4"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handlePrint('individual', enrollment)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Print
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Create New Enrollment</h2>
                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleFormChange}
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
                                    onChange={handleFormChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
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
                                    onChange={handleFormChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Package</label>
                                <select
                                    name="package"
                                    value={formData.package}
                                    onChange={handleFormChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select a package</option>
                                    <option value="Entry Pack">Entry Pack</option>
                                    <option value="Elite Pack">Elite Pack</option>
                                    <option value="Pro Pack">Pro Pack</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Edit Enrollment</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleFormChange}
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
                                    onChange={handleFormChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
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
                                    onChange={handleFormChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Package</label>
                                <select
                                    name="package"
                                    value={formData.package}
                                    onChange={handleFormChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Select a package</option>
                                    <option value="Entry Pack">Entry Pack</option>
                                    <option value="Elite Pack">Elite Pack</option>
                                    <option value="Pro Pack">Pro Pack</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Delete Enrollment</h2>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete the enrollment for {selectedEnrollment.firstName} {selectedEnrollment.lastName}?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Print Preview Modal */}
            {showPrintPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">Print Preview</h2>
                            <p className="text-sm text-gray-600">
                                {printMode === 'list' ? 'All Enrollments' : 'Individual Enrollment'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <PrintEnrollment
                                enrollment={printMode === 'list' ? enrollments : selectedEnrollment}
                                isList={printMode === 'list'}
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handlePrintCancel}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePrintConfirm}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard; 