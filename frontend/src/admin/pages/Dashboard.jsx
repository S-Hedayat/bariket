const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to the Bariket admin panel!</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-2xl mt-2">120</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="text-2xl mt-2">85</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-2xl mt-2">45</p>
        </div>
        <div className="p-4 bg-white shadow rounded-lg text-center">
          <h2 className="text-lg font-semibold">Comments</h2>
          <p className="text-2xl mt-2">200</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
