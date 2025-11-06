function StatsCard({ title, value, icon: Icon, trend, trendUp }) {
  return (
    <div 
      className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm mb-1 dark:text-gray-400 text-gray-500">{title}</p>
            <h3 className="mb-2 text-2xl font-bold dark:text-gray-200 text-gray-900">{value}</h3>
            {trend && (
              <p
                className="text-sm"
                style={{ color: trendUp ? '#627B4A' : '#D4183D' }}
              >
                {trend}
              </p>
            )}
          </div>
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0"
            style={{
              background: 'linear-gradient(to bottom right, rgba(108, 166, 205, 0.2), rgba(178, 165, 255, 0.2))'
            }}
          >
            <Icon className="h-6 w-6" style={{ color: '#6CA6CD' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;

