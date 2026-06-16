
import useAuth from '../context/useAuth';

const CreatorDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="p-20 text-white">
        <h1 className="text-4xl font-bold mb-4">Creator Dashboard</h1>
        <p>Welcome back, {user?.name}!</p>
        <button onClick={logout} className="mt-4 bg-red-600 px-4 py-2 rounded">
            Log Out
        </button>
        </div>
    );
};

export default CreatorDashboard;