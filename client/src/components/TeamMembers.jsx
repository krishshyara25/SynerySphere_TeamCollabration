import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MaterialReactTable } from 'material-react-table';
import { Box, Button, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const TeamMembers = () => {
  const team_code = sessionStorage.getItem('team_code')?.replace(/['"]+/g, '');
  const token = sessionStorage.getItem('token');
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    title: '',
    email: '',
    role: '',
    password: '',
    team_code: team_code,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // CSV Export Configuration
  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  });

  // Fetch team members
  useEffect(() => {
    const fetchMembers = async () => {
      if (!team_code || !token) {
        setError('Missing team code or authentication token');
        toast.error('Please log in again');
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (Array.isArray(response.data)) {
          setMembers(response.data);
          setError('');
        } else {
          setMembers([]);
          setError('No team members found');
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast.error(error.response?.data?.message || 'Error fetching team members');
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [team_code, token, navigate]);

  // Handle Export to CSV
  const handleExportData = () => {
    if (!fileName) {
      toast.error('Please enter a file name');
      return;
    }

    const filteredData = members.map((member) => ({
      full_name: member.full_name,
      title: member.title,
      email: member.email,
      role: member.role,
    }));

    const csv = generateCsv(csvConfig)(filteredData);
    download(csvConfig)(csv, `${fileName}.csv`);
    setIsExportDialogOpen(false);
    setFileName('');
    toast.success('Data exported successfully!');
  };

  // Handle Adding a User
  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.role || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        team_code: team_code,
        full_name: formData.full_name.trim(),
        title: formData.title.trim(),
        email: formData.email.toLowerCase().trim(),
        role: formData.role.toLowerCase(),
        password: formData.password,
      };

      await axios.post('https://task-bridge-eyh5.onrender.com/team/new_user', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setMembers(updatedMembersResponse.data);

      setIsAddDialogOpen(false);
      setFormData({
        full_name: '',
        title: '',
        email: '',
        role: '',
        password: '',
        team_code: team_code,
      });
      toast.success('User added successfully!');
    } catch (err) {
      console.error('Error adding user:', err);
      toast.error(err.response?.data?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  // Handle Editing a User
  const handleEditUser = async (userData) => {
    if (!selectedUser) {
      toast.error('No user selected for editing');
      return;
    }

    setLoading(true);
    try {
      await axios.patch(
        `https://task-bridge-eyh5.onrender.com/team/user/${selectedUser.full_name}/${team_code}/edit`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setMembers(updatedMembersResponse.data);

      toast.success('User updated successfully!');
      setShowEditDialog(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || 'Error updating user');
    } finally {
      setLoading(false);
    }
  };

  // Handle Deleting a User
  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.full_name}?`)) {
      setLoading(true);
      try {
        await axios.delete(`https://task-bridge-eyh5.onrender.com/team/user/${user.full_name}/${team_code}/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const updatedMembersResponse = await axios.get(`https://task-bridge-eyh5.onrender.com/team/${team_code}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setMembers(updatedMembersResponse.data);

        toast.success('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error(error.response?.data?.message || 'Error deleting user');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle Form Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Table Columns
  const columns = useMemo(
    () => [
      { accessorKey: 'full_name', header: 'Full Name' },
      { accessorKey: 'title', header: 'Title' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'role', header: 'Role' },
      {
        id: 'actions',
        header: 'Actions',
        Cell: ({ row }) => (
          <Box className="flex gap-2">
            <Tooltip title="Edit">
              <IconButton onClick={() => setSelectedUser(row.original) || setShowEditDialog(true)}>
                <EditIcon className="text-blue-500" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDeleteUser(row.original)}>
                <DeleteIcon className="text-red-500" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Team Members</h1>
          <div className="flex gap-4">
            <Button
              variant="contained"
              className="bg-blue-600 hover:bg-blue-700"
              startIcon={<AddIcon />}
              onClick={() => setIsAddDialogOpen(true)}
            >
              Add Member
            </Button>
            <Button
              variant="outlined"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              onClick={() => setIsExportDialogOpen(true)}
            >
              Export to CSV
            </Button>
            <Button
              variant="outlined"
              className="border-gray-600 text-gray-600 hover:bg-gray-50"
              onClick={() => navigate('/home')}
            >
              Back to Home
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Team Members Table */}
        <MaterialReactTable
          columns={columns}
          data={members}
          enableRowSelection={false}
          enableSorting
          enableColumnFilters
          enablePagination
          enableColumnResizing
          initialState={{ density: 'comfortable' }}
          muiTablePaperProps={{
            sx: { borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
          }}
        />

        {/* Add Member Dialog */}
        <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle className="flex justify-between items-center">
            <span>Add New Team Member</span>
            <IconButton onClick={() => setIsAddDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength="6"
                />
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} variant="contained" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle className="flex justify-between items-center">
            <span>Edit User</span>
            <IconButton onClick={() => setShowEditDialog(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <EditUserForm
                user={selectedUser}
                onSubmit={handleEditUser}
                onCancel={() => setShowEditDialog(false)}
                updating={loading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Export File Name Dialog */}
        <Dialog open={isExportDialogOpen} onClose={() => setIsExportDialogOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Export Team Members</DialogTitle>
          <DialogContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Enter a name for the exported CSV file:</p>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="File Name"
                className="block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExportData} variant="contained" className="bg-blue-600 hover:bg-blue-700">
              Export
            </Button>
          </DialogActions>
        </Dialog>

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

const EditUserForm = ({ user, onSubmit, onCancel, updating }) => {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    title: user.title || '',
    email: user.email || '',
    role: user.role || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          readOnly
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div className="flex justify-end gap-4">
        <Button onClick={onCancel} disabled={updating}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          className="bg-blue-600 hover:bg-blue-700"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Update User'}
        </Button>
      </div>
    </form>
  );
};

export default TeamMembers;