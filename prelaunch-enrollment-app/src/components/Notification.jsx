import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const textColor = 'text-white';

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${bgColor} ${textColor}`}>
            <div className="flex items-center">
                <span className="mr-2">
                    {type === 'success' ? '✓' : '✕'}
                </span>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Notification; 