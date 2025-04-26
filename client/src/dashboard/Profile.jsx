import React, { useState } from 'react'

const Profile = () => {
    const [userRole, setUserRole] = useState('contributor');
    
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Your Profile</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value="currentuser@example.com"
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                        type="text"
                        value={userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                    <p className="mt-1 text-sm text-gray-500">Roles are assigned by administrators</p>
                </div>
            </div>
        </div>
    )
}

export default Profile
