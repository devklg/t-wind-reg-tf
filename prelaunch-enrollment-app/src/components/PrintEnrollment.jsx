import React from 'react';

const PrintEnrollment = ({ enrollment, isList }) => {
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

    if (isList) {
        return (
            <div className="print:block hidden">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-center mb-4">Enrollment List</h1>
                    <p className="text-center text-gray-600">Generated on {formatDate(new Date())}</p>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Package</th>
                            <th className="border p-2">Status</th>
                            <th className="border p-2">Enrollment Date</th>
                            <th className="border p-2">Personal Volume</th>
                            <th className="border p-2">Team Volume</th>
                            <th className="border p-2">Total Volume</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollment.map((enroll) => (
                            <tr key={enroll._id}>
                                <td className="border p-2">{enroll.firstName} {enroll.lastName}</td>
                                <td className="border p-2">{enroll.email}</td>
                                <td className="border p-2">{enroll.package}</td>
                                <td className="border p-2">{enroll.status}</td>
                                <td className="border p-2">{formatDate(enroll.createdAt)}</td>
                                <td className="border p-2">{formatCurrency(enroll.personalVolume)}</td>
                                <td className="border p-2">{formatCurrency(enroll.teamVolume)}</td>
                                <td className="border p-2">{formatCurrency(enroll.salesVolume)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="print:block hidden">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-center mb-4">Enrollment Details</h1>
                <p className="text-center text-gray-600">Generated on {formatDate(new Date())}</p>
            </div>

            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Name:</p>
                            <p>{enrollment.firstName} {enrollment.lastName}</p>
                        </div>
                        <div>
                            <p className="font-medium">Email:</p>
                            <p>{enrollment.email}</p>
                        </div>
                        <div>
                            <p className="font-medium">Phone:</p>
                            <p>{enrollment.phone}</p>
                        </div>
                        <div>
                            <p className="font-medium">Status:</p>
                            <p>{enrollment.status}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Sponsor Information</h2>
                    <div>
                        <p className="font-medium">Sponsor Name:</p>
                        <p>{enrollment.sponsorName}</p>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Package Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">Package:</p>
                            <p>{enrollment.package}</p>
                        </div>
                        <div>
                            <p className="font-medium">Payment Method:</p>
                            <p>{enrollment.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="font-medium">Enrollment Date:</p>
                            <p>{formatDate(enrollment.createdAt)}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Volume Information</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <p className="font-medium">Personal Volume:</p>
                            <p>{formatCurrency(enrollment.personalVolume)}</p>
                        </div>
                        <div>
                            <p className="font-medium">Team Volume:</p>
                            <p>{formatCurrency(enrollment.teamVolume)}</p>
                        </div>
                        <div>
                            <p className="font-medium">Total Volume:</p>
                            <p>{formatCurrency(enrollment.salesVolume)}</p>
                        </div>
                        <div>
                            <p className="font-medium">Fast Start Bonus:</p>
                            <p>{formatCurrency(enrollment.fastStartBonus)}</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Address Information</h2>
                    <div>
                        <p>{enrollment.address}</p>
                        <p>{enrollment.city}, {enrollment.state} {enrollment.zipCode}</p>
                        <p>{enrollment.country}</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PrintEnrollment; 