import React, { useState, useEffect } from 'react';
// import { Search, Plus, Eye, Trash2, ChevronDown, MessageSquare } from 'lucide-react';

const ProjectExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedLabel, setSelectedLabel] = useState('All');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    category: 'All',
    location: 'All',
    status: 'Draft',
    description: '',
  });

  const stages = ['All', 'todo', 'in progress', 'review', 'done'];
  const priorities = ['All', 'high', 'medium', 'normal', 'low'];
  const labels = ['All', 'research', 'design', 'content', 'planning'];
  const categories = ['All', 'Marketing', 'Sales', 'HR', 'Development', 'Design', 'Operations'];
  const locations = ['All', 'London', 'New York', 'Berlin', 'San Francisco', 'Remote', 'Tokyo'];
  const statuses = ['Draft', 'Active', 'Archived'];

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    const teamCode = sessionStorage.getItem('team_code');
    if (token && storedUser && teamCode) {
      setUser({
        _id: storedUser.userID,
        team_code: teamCode,
        isAdmin: storedUser.role === 'admin',
        full_name: storedUser.full_name,
      });
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        let url = `https://task-bridge-eyh5.onrender.com/api/tasks/${user.team_code}`;
        if (selectedStage !== 'All') {
          url = `https://task-bridge-eyh5.onrender.com/api/tasks/stage/${selectedStage}/${user.team_code}`;
        }
        if (searchTerm) url += `?search=${searchTerm}`;
        if (selectedPriority !== 'All') url += `${searchTerm ? '&' : '?'}priority=${selectedPriority}`;
        if (selectedLabel !== 'All') url += `${searchTerm || selectedPriority !== 'All' ? '&' : '?'}label=${selectedLabel}`;

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, got: ${text.substring(0, 50)}...`);
        }

        const data = await response.json();
        setTasks(Array.isArray(data) ? data : data.tasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user, searchTerm, selectedStage, selectedPriority, selectedLabel]);

  const getStageBadge = (stage) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (stage) {
      case 'todo':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'in progress':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'review':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'done':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return baseClasses;
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedStage('All');
    setSelectedPriority('All');
    setSelectedLabel('All');
  };

  const handleAddTask = async () => {
    if (!user || !user.isAdmin) {
      alert('Only admins can create tasks');
      return;
    }
    try {
      const taskData = {
        ...newTask,
        title: newTask.title || 'Untitled',
        date: new Date(newTask.date).toISOString(),
        category: newTask.category === 'All' ? undefined : newTask.category,
        location: newTask.location === 'All' ? undefined : newTask.location,
        status: newTask.status,
        description: newTask.description || undefined,
        priority: 'normal',
        stage: 'todo',
        team: [user._id],
        team_code: user.team_code,
      };
      const response = await fetch('https://task-bridge-eyh5.onrender.com/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const task = await response.json();
      setTasks([...tasks, task]);
      setIsModalOpen(false);
      setNewTask({ title: '', date: new Date().toISOString().split('T')[0], category: 'All', location: 'All', status: 'Draft', description: '' });
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!user || !user.isAdmin) {
      alert('Only admins can delete tasks');
      return;
    }
    try {
      const response = await fetch(`https://task-bridge-eyh5.onrender.com/api/tasks/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const handleAddComment = async (id) => {
    if (!user) {
      alert('You must be logged in to comment');
      return;
    }
    const text = prompt('Enter comment');
    const type = prompt('Enter type (assigned, started, in progress, bug, completed, commented)');
    if (!text) return;
    try {
      const response = await fetch(`https://task-bridge-eyh5.onrender.com/api/tasks/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({ text, type }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedTask = await response.json();
      setTasks(tasks.map((task) => (task._id === id ? updatedTask : task)));
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  };

  if (!user) {
    return <div className="min-h-screen bg-gray-50 p-6 text-center">Please log in to view tasks.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Explorer</h1>
            <p className="text-gray-600">Manage tasks for team {user.team_code}</p>
          </div>
          {user.isAdmin && (
            <button
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              Add New Task
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search tasks, keywords..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
              <div className="relative">
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="relative">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Label</label>
              <div className="relative">
                <select
                  value={selectedLabel}
                  onChange={(e) => setSelectedLabel(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {labels.map((label) => (
                    <option key={label} value={label}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <button
                onClick={handleReset}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium mt-6"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Title</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Stage</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Priority</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Label</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Team</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-4 px-6 text-center text-gray-600">Loading...</td>
                  </tr>
                ) : (
                  tasks.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900">{item.title}</td>
                      <td className="py-4 px-6">
                        <span className={getStageBadge(item.stage)}>{item.stage}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{item.priority}</td>
                      <td className="py-4 px-6 text-gray-600">{item.label || 'None'}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {item.team ? item.team.map((member) => member.full_name).join(', ') : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-gray-600">{new Date(item.date).toLocaleDateString('en-US')}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye size={16} />
                          </button>
                          {user.isAdmin && (
                            <button
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              onClick={() => handleDeleteTask(item._id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          <button
                            className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => handleAddComment(item._id)}
                          >
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Task Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h2>
              <p className="text-sm text-gray-600 mb-6">Fill out the details below.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    value={newTask.date}
                    onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <select
                    value={newTask.location}
                    onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {locations.map((location) => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task description"
                    rows="3"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-4">
                <button
                  className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  onClick={handleAddTask}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectExplorer;