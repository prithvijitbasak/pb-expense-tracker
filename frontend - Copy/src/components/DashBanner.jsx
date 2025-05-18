const DashBanner = () => {
  return (
    <div className="bg-[var(--top-color)] mt-4">
      <div className="container">
        <div className="py-3">
          <h1 className="font-bold text-center text-white text-3xl tracking-wider pb-2">PB Expense Tracker</h1>
          <h2 className="font-medium text-center text-white text-xl tracking-wide pb-2">
            Track your day-to-day expenses
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashBanner;
