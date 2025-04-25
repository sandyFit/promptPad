import React from 'react';

const Users = () => {
    return (
        <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">User Management</h3>
            <p>This panel is only visible to administrators.</p>
            <div className="border rounded-md mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">alex@example.com</td>
                            <td className="px-6 py-4 whitespace-nowrap">Contributor</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button className="text-purple-600 hover:text-purple-700">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">sam@example.com</td>
                            <td className="px-6 py-4 whitespace-nowrap">Moderator</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button className="text-purple-600 hover:text-purple-700">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">taylor@example.com</td>
                            <td className="px-6 py-4 whitespace-nowrap">Viewer</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <button className="text-purple-600 hover:text-purple-700">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <button className="mt-4 flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                <Plus size={18} className="mr-2" />
                Invite User
            </button>
        </section>
    )
}

export default Users
