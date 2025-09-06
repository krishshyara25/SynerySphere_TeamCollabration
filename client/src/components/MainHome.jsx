import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const MainHome = () => {
  const name = sessionStorage.getItem('full_name');
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      title: "Task Management",
      icon: "📊",
      path: "/task",
      className: "bg-gradient-to-br from-yellow-100 to-yellow-200",
      color: "#FFA726"
    },
    {
      id: 2,
      title: "Video Conferencing",
      icon: "🎥",
      path: "/meeting",
      className: "bg-gradient-to-br from-orange-100 to-orange-200",
      color: "#FF7043"
    },
    {
      id: 3,
      title: "Document Sharing",
      icon: "📄",
      path: "/documents",
      className: "bg-gradient-to-br from-green-100 to-green-200",
      color: "#66BB6A"
    },
    {
      id: 4,
      title: "Virtual Whiteboard",
      icon: "🖊️",
      path: "/whiteboard",
      className: "bg-gradient-to-br from-blue-100 to-blue-200",
      color: "#42A5F5"
    },
    {
      id: 5,
      title: "Messaging",
      icon: "💬",
      path: "/chat",
      className: "bg-gradient-to-br from-purple-100 to-purple-200",
      color: "#AB47BC"
    },
    {
      id: 6,
      title: "Calendar",
      icon: "📅",
      path: "/calendar",
      className: "bg-gradient-to-br from-pink-100 to-pink-200",
      color: "#EC407A"
    }
  ];

  // Sample data for charts
  const pieData = [
    { name: 'Completed', value: 65, color: '#4CAF50' },
    { name: 'In Progress', value: 25, color: '#FF9800' },
    { name: 'Pending', value: 10, color: '#F44336' }
  ];

  const lineData = [
    { name: 'Mon', tasks: 12, meetings: 5 },
    { name: 'Tue', tasks: 19, meetings: 8 },
    { name: 'Wed', tasks: 15, meetings: 12 },
    { name: 'Thu', tasks: 25, meetings: 15 },
    { name: 'Fri', tasks: 22, meetings: 10 },
    { name: 'Sat', tasks: 18, meetings: 6 },
    { name: 'Sun', tasks: 8, meetings: 3 }
  ];

  const barData = [
    { name: 'Tasks', value: 234, color: '#6366F1' },
    { name: 'Meetings', value: 156, color: '#8B5CF6' },
    { name: 'Documents', value: 89, color: '#06B6D4' },
    { name: 'Messages', value: 445, color: '#10B981' }
  ];

  const upcomingTasks = [
    { id: 1, title: 'Team Meeting Preparation', time: '2:00 PM', priority: 'high' },
    { id: 2, title: 'Review Project Documents', time: '4:30 PM', priority: 'medium' },
    { id: 3, title: 'Client Presentation', time: '6:00 PM', priority: 'high' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #6366F1 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>
      
      {/* Navigation */}
      <nav className="flex justify-between items-center p-4 bg-white/90 backdrop-blur-sm shadow-lg relative z-10 border-b border-gray-200">
        <div className="mt-2">
          <div className="h-[50px] w-[90px] bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">TB</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
          <div className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-300 cursor-pointer" onClick={() => handleNavClick('/')}>
            <span>🏠</span>
            <span className="font-medium">Home</span>
          </div>
          <button onClick={() => handleNavClick('/contact')} className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-300">
            <span className="font-medium">Contact Us</span>
          </button>
          <button onClick={() => handleNavClick('/about')} className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-300">
            <span className="font-medium">About Us</span>
          </button>
          <button onClick={() => handleNavClick('/faq')} className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-300">
            <span className="font-medium">FAQ</span>
          </button>
          <button onClick={() => handleNavClick('/team')} className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-300">
            <span>👥</span>
            <span className="font-medium">Team</span>
          </button>
          <button onClick={() => handleNavClick('/profile')} className="flex items-center gap-3 text-gray-700 bg-indigo-50 px-3 py-2 rounded-full hover:bg-indigo-100 transition-colors">
            <div className="w-[32px] h-[32px] rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
              {name?.charAt(0) || 'U'}
            </div>
            <span className="font-medium">{name}</span>
          </button>
        </div>
      </nav>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-sm shadow-xl p-6 relative z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Hi, {name?.split(' ')[0] || 'User'}!</h2>
            <p className="text-gray-600">Welcome back to your workspace</p>
          </div>
          
          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.path)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 hover:shadow-md transition-all duration-300 group"
              >
                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="font-medium text-gray-700 group-hover:text-indigo-600">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">234</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-green-500 text-sm font-medium">+12%</span>
                <span className="text-gray-500 text-sm ml-1">from last week</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Meetings Today</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">8</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">🎥</span>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-blue-500 text-sm font-medium">3 upcoming</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Team Members</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">24</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👥</span>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-green-500 text-sm font-medium">18 online</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">87%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📈</span>
                </div>
              </div>
              <div className="flex items-center mt-4">
                <span className="text-green-500 text-sm font-medium">+5%</span>
                <span className="text-gray-500 text-sm ml-1">from last month</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Task Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={1000}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600 font-medium">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Weekly Performance
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#888" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="tasks" 
                      stroke="#6366F1" 
                      strokeWidth={3} 
                      dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, fill: '#6366F1' }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-sm text-gray-600 font-medium">Tasks Completed</span>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                Activity Overview
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      type="number" 
                      stroke="#888" 
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      stroke="#888" 
                      fontSize={12}
                      tickLine={false}
                      width={80}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      radius={[0, 8, 8, 0]}
                      animationDuration={1200}
                    >
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Quick Access
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {menuItems.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex flex-col items-center justify-center p-6 rounded-xl ${item.className} hover:shadow-lg hover:-translate-y-2 hover:scale-105 transition-all duration-300 border border-white/50`}
                  >
                    <div className="text-3xl mb-3 filter drop-shadow-sm">{item.icon}</div>
                    <span className="text-sm text-center font-semibold text-gray-700">{item.title}</span>
                    <div className="w-full h-1 bg-white/30 rounded-full mt-2">
                      <div className="h-full bg-white/60 rounded-full" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Upcoming Tasks
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Today</span>
              </h3>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-indigo-50 hover:to-indigo-100 transition-all duration-300 border border-gray-200 hover:border-indigo-200">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-gray-800">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">🕒</span>
                          <p className="text-sm text-gray-600">{task.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                      task.priority === 'high' 
                        ? 'bg-red-100 text-red-700 border border-red-200' 
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {task.priority}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handleNavClick('/task')}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                View All Tasks →
              </button>
            </div>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Projects</p>
                  <p className="text-3xl font-bold mt-1">12</p>
                  <p className="text-blue-200 text-sm mt-2">5 due this week</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Files Shared</p>
                  <p className="text-3xl font-bold mt-1">1.2K</p>
                  <p className="text-green-200 text-sm mt-2">+15% this month</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Messages Sent</p>
                  <p className="text-3xl font-bold mt-1">2.8K</p>
                  <p className="text-purple-200 text-sm mt-2">156 today</p>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHome;