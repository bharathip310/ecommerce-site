import { motion } from 'framer-motion';
import { DollarSign, Users, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownRight, Package, Loader2, CreditCard, Activity } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAdminGetDashboardQuery } from '../../redux/apiSlice.ts';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 4000, visitors: 2400 },
  { name: 'Feb', revenue: 3000, visitors: 1398 },
  { name: 'Mar', revenue: 5000, visitors: 8800 },
  { name: 'Apr', revenue: 2780, visitors: 3908 },
  { name: 'May', revenue: 8890, visitors: 4800 },
  { name: 'Jun', revenue: 7390, visitors: 3800 },
  { name: 'Jul', revenue: 11490, visitors: 6300 },
  { name: 'Aug', revenue: 14490, visitors: 8300 },
];

export function AdminDashboard() {
  const { data: dashboardData, isLoading } = useAdminGetDashboardQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 text-slate-300 animate-spin" />
      </div>
    );
  }

  const STATS = [
    { label: 'Total Revenue', value: dashboardData?.totalRevenue || '₹0.00', change: '+20.1%', trend: 'up', icon: DollarSign, color: 'bg-emerald-100 text-emerald-600' },
    { label: 'Active Users', value: dashboardData?.activeUsers || '0', change: '+15.2%', trend: 'up', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'New Orders', value: dashboardData?.totalOrders || '0', change: '-4.3%', trend: 'down', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
    { label: 'Conversion Rate', value: dashboardData?.conversionRate || '0.00%', change: '+2.4%', trend: 'up', icon: Activity, color: 'bg-orange-100 text-orange-600' },
  ];

  const recentOrders = dashboardData?.recentOrders || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center text-sm font-bold px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {stat.change}
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-500 mb-1">{stat.label}</h3>
              <div className="text-2xl lg:text-xl xl:text-2xl 2xl:text-3xl font-black text-slate-800 tracking-tight break-words">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg text-slate-800">Revenue Overview</h3>
              <p className="text-sm text-slate-500 font-medium">Monthly revenue and traffic comparison</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary-blue focus:border-primary-blue block p-2.5 outline-none font-medium">
              <option>This Year</option>
              <option>Last Year</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2874f0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2874f0" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="4 4" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2874f0" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Mini */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-stretch">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800">Recent Transactions</h3>
            <button className="text-primary-blue text-sm font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-6 flex-1">
            {recentOrders.length > 0 ? recentOrders.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    item.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-500' :
                    item.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-500' :
                    'bg-red-50 text-red-500'
                  }`}>
                    {item.paymentStatus === 'paid' ? <ShoppingBag className="w-5 h-5" /> : 
                     item.paymentStatus === 'pending' ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                     <CreditCard className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-primary-blue transition-colors">
                      {item.id}
                    </h4>
                    <p className="text-xs font-medium text-slate-400">{item.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-bold text-slate-800">{item.amount}</span>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    item.paymentStatus === 'paid' ? 'text-emerald-500' :
                    item.paymentStatus === 'pending' ? 'text-amber-500' :
                    'text-red-500'
                  }`}>{item.paymentStatus}</span>
                </div>
              </div>
            )) : (
              <div className="text-sm text-slate-500 text-center py-10">No recent transactions</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
