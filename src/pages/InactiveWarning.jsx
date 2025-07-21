const InactiveWarning = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">Account Inactive</h1>
        <p className="text-gray-600">
          Your account has been deactivated. Please contact support to reactivate your access.
        </p>
      </div>
    </div>
  );
};

export default InactiveWarning;
