import React from 'react';

const CompensationPlan = () => {
    const ranks = [
        { name: 'Bronze', cycles: 1, commission: 25 },
        { name: 'Silver', cycles: 5, commission: 125 },
        { name: 'Gold', cycles: 10, commission: 250 },
        { name: '1 Star', cycles: 20, commission: 500 },
        { name: '2 Star', cycles: 30, commission: 750 },
        { name: '3 Star', cycles: 50, commission: 1250 },
        { name: 'Diamond', cycles: 100, commission: 2500 },
        { name: 'Double Diamond', cycles: 150, commission: 3750 },
        { name: 'Triple Diamond', cycles: 200, commission: 5000 },
        { name: 'Diamond Elite', cycles: 250, commission: 6500 },
        { name: 'Blue Diamond', cycles: 500, commission: 12500 }
    ];

    const fastStartBonuses = [
        { package: 'Starter Package', bonus: 50 },
        { package: 'Elite Package', bonus: 100 },
        { package: 'Pro Package', bonus: 200 }
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-center mb-8">Talk Fusion Compensation Plan</h2>

            {/* Fast Start Bonuses */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Fast Start Bonuses</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {fastStartBonuses.map((bonus, index) => (
                        <div key={index} className="text-center p-4 border rounded-lg">
                            <h4 className="font-semibold">{bonus.package}</h4>
                            <p className="text-2xl font-bold text-blue-600">${bonus.bonus}</p>
                            <p className="text-sm text-gray-600">One-time bonus</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Commissions */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Team Commissions</h3>
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Earn $25 USD each time your Team accumulates 200 Group Sales Volume (GSV) Left & 200 (GSV) Right.
                        You can do this over and over again each day, up to $50,000 USD per week.
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Example:</h4>
                        <p className="text-gray-700">
                            You have 2,000 SV on the Left and 2,000 SV on the Right.
                            You would earn $250 USD based upon 10 cycles in the week.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mega Matching Bonuses */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Mega Matching Bonuses</h3>
                <div className="space-y-4">
                    <p className="text-gray-700">
                        Earn additional 10% of the Team Commissions of your Personally Sponsored Promoters and
                        ANOTHER 10% for their Personally Sponsored Promoters (2nd Generation).
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Example:</h4>
                        <p className="text-gray-700">
                            If you Sponsored John and his Team Commissions were $500 USD, and John Sponsored Sue
                            and her Team Commissions were $1,000 USD, you would earn an extra $50 USD from John,
                            and an extra $100 USD from Sue. That's a TOTAL of $150 USD in Mega Matching Bonuses!
                        </p>
                    </div>
                </div>
            </div>

            {/* Rank Advancement Bonuses */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Rank Advancement Bonuses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold mb-2">One-time Bonuses:</h4>
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span>3 Star</span>
                                <span className="font-semibold">$500 USD</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Diamond</span>
                                <span className="font-semibold">$1,000 USD</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Double Diamond</span>
                                <span className="font-semibold">$2,000 USD</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Triple Diamond</span>
                                <span className="font-semibold">$3,000 USD</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Diamond Elite</span>
                                <span className="font-semibold">$5,000 USD</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Leadership Pool */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-4">Leadership Pool</h3>
                <p className="text-gray-700">
                    The Leadership Pool is a revenue-sharing Bonus Pool earned by Qualified Blue Diamonds,
                    who will share in 1% of the total Sales Volume that is generated WORLDWIDE!
                </p>
            </div>

            {/* Rank System */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Rank System</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Cycles</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly Commission</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {ranks.map((rank, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rank.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rank.cycles}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${rank.commission} USD</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CompensationPlan; 