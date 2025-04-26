import React from 'react'

const Settings = () => {
    // const [userRole, setUserRole] = useState('contributor');
    
    return (
        <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium mb-4">Settings</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                        Change Password
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notification Preferences</label>
                    <div className="flex items-center">
                        <input type="checkbox" id="notifications" className="h-4 w-4 text-purple-600 border-gray-300 rounded" />
                        <label htmlFor="notifications" className="ml-2 text-sm text-gray-700">Email notifications for new prompts</label>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Settings
