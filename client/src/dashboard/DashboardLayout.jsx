import { Outlet } from 'react-router-dom';
import Sidebar from '../layouts/Sidebar';
import Navbar from '../layouts/Navbar';


const DashboardLayout = () => {


    return (
        <section className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-hidden flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </section>
    );
}

export default DashboardLayout;
