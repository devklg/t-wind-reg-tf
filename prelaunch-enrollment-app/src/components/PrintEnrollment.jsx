import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const PrintEnrollment = ({ enrollment, mode = 'individual' }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: mode === 'list' ? 'Enrollment List' : `Enrollment - ${enrollment.firstName} ${enrollment.lastName}`,
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (mode === 'list') {
        return (
            <div className="print-container">
                <h2 className="text-2xl font-bold mb-4">Enrollment List</h2>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Package</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollment.map((enroll) => (
                            <tr key={enroll._id}>
                                <td>{enroll.enrollmentId}</td>
                                <td>{`${enroll.firstName} ${enroll.lastName}`}</td>
                                <td>{enroll.email}</td>
                                <td>{enroll.package}</td>
                                <td>{enroll.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="print-container">
            <div className="enrollment-details">
                <h2 className="text-2xl font-bold mb-4">Enrollment Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold">Personal Information</h3>
                        <p>ID: {enrollment.enrollmentId}</p>
                        <p>Name: {`${enrollment.firstName} ${enrollment.lastName}`}</p>
                        <p>Email: {enrollment.email}</p>
                        <p>Phone: {enrollment.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Address</h3>
                        <p>{enrollment.address || 'N/A'}</p>
                        <p>{`${enrollment.city || ''} ${enrollment.state || ''} ${enrollment.zipCode || ''}`}</p>
                        <p>{enrollment.country || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Package Information</h3>
                        <p>Package: {enrollment.package}</p>
                        <p>Status: {enrollment.status}</p>
                        <p>Enrollment Date: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Sponsor Information</h3>
                        <p>Sponsor Name: {enrollment.sponsorName}</p>
                        <p>Sponsor ID: {enrollment.sponsorId || 'N/A'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintEnrollment; 