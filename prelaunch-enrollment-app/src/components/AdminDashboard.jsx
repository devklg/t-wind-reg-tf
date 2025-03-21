import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';
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
    const [editing, setEditing] = useState(false);
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
        package: '',
        status: ''
    });

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const data = await apiService.getEnrollments();
            setEnrollments(data);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            toast.error('Failed to load enrollments');
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

    const handleStatusChange = async (id, newStatus) => {
        try {
            await apiService.updateEnrollmentStatus(id, newStatus);
            toast.success('Status updated successfully');
            fetchEnrollments();
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const handleEdit = (enrollment) => {
        setSelectedEnrollment(enrollment);
        setFormData({
            firstName: enrollment.firstName,
            lastName: enrollment.lastName,
            email: enrollment.email,
            phone: enrollment.phone || '',
            address: enrollment.address || '',
            city: enrollment.city || '',
            state: enrollment.state || '',
            zipCode: enrollment.zipCode || '',
            country: enrollment.country || '',
            sponsorName: enrollment.sponsorName,
            package: enrollment.package,
            status: enrollment.status
        });
        setEditing(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateEnrollment(selectedEnrollment._id, formData);
            toast.success('Enrollment updated successfully');
            setEditing(false);
            fetchEnrollments();
        } catch (error) {
            console.error('Error updating enrollment:', error);
            toast.error('Failed to update enrollment');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this enrollment?')) {
            try {
                await apiService.deleteEnrollment(id);
                toast.success('Enrollment deleted successfully');
                fetchEnrollments();
            } catch (error) {
                console.error('Error deleting enrollment:', error);
                toast.error('Failed to delete enrollment');
            }
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreate = () => {
        setFormData({
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
            package: '',
            status: ''
        });
        setShowCreateModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Enrollment Management</h2>

                        {editing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleFormChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleFormChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Package</label>
                                    <select
                                        name="package"
                                        value={formData.package}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="Entry Pack">Entry Pack</option>
                                        <option value="Elite Pack">Elite Pack</option>
                                        <option value="Pro Pack">Pro Pack</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                        <option value="Terminated">Terminated</option>
                                    </select>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditing(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Package
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {enrollments.map((enrollment) => (
                                            <tr key={enrollment._id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {enrollment.enrollmentId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {`${enrollment.firstName} ${enrollment.lastName}`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {enrollment.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {enrollment.package}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <select
                                                        value={enrollment.status}
                                                        onChange={(e) => handleStatusChange(enrollment._id, e.target.value)}
                                                        className="text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="Active">Active</option>
                                                        <option value="Suspended">Suspended</option>
                                                        <option value="Terminated">Terminated</option>
                                                    </select>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <button
                                                        onClick={() => handleEdit(enrollment)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(enrollment._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 