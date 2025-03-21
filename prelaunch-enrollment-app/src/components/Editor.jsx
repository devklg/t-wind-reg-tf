import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import Notification from './Notification';
import PrintEnrollment from './PrintEnrollment';

const Editor = () => {
    const { id } = useParams();
    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    useEffect(() => {
        fetchEnrollment();
    }, [id]);

    const fetchEnrollment = async () => {
        try {
            const data = await api.getEnrollment(id);
            setEnrollment(data);
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Failed to fetch enrollment details'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        setShowPrintPreview(true);
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
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    Enrollment not found
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Edit Enrollment</h1>
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Print Enrollment
                </button>
            </div>

            {/* Print Preview Modal */}
            {showPrintPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold">Print Preview</h2>
                            <p className="text-sm text-gray-600">Enrollment Details</p>
                        </div>

                        <div className="mb-4">
                            <PrintEnrollment
                                enrollment={enrollment}
                                isList={false}
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowPrintPreview(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rest of the editor form */}
            // ... existing code ...
        </div>
    );
};

export default Editor; 