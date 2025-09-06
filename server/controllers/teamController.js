// controllers/teamController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

// get Team Members
exports.getTeamMembers = async (req, res) => {
    try {
        const team_code = req.params.team_code;
        const members = await User.find({ team_code });
        if (members.length) {
            res.status(200).json(members);
        } else {
            res.status(404).json({ message: "No team members found" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error fetching team members", error: err.message });
    }
};

// Add User (Member)
exports.addUser = async (req, res) => {
    const { team_code, full_name, title, email, role, password } = req.body;

    if (!team_code || !full_name || !email || !role || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $and: [{ email }, { team_code },{role}] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            team_code,
            full_name,
            title,
            email,
            role,
            password: hashedPassword,
        });

        // Save the user to the database
        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Detailed error:', err);
        return res.status(500).json({ 
            message: 'Internal server error in adding new user',
            error: err.message,
            details: err.errors // This will include validation errors if any
        });
    }
};

// Edit User (Member)
exports.editUser = async (req, res) => {
    try {
        const {full_name,team_code} = req.params;
        const updates = req.body;
        const result = await User.updateOne({ full_name , team_code }, { $set: updates });
        res.status(200).json({ message: `${result.modifiedCount} document(s) updated` });
    } catch (err) {
        res.status(500).json({ message: "Error updating user", error: err.message });
    }
};


// Delete User (Member)
exports.deleteUser = async (req, res) => {
    try {
        let { full_name, team_code } = req.params;

        console.log(`Deleting user: ${full_name}, Team: ${team_code}`);
        const result = await User.deleteOne({ full_name, team_code });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting user", error: err.message });
    }
};



// Import members from CSV
exports.importMembers = async (req, res) => {
    console.log('Request Body:', req.body); // Log the incoming request body
    const { team_code, members } = req.body;
  
    try {
      // Validate input
      if (!team_code || !Array.isArray(members)) {
        return res.status(400).json({ success: false, message: 'Invalid input' });
      }
  
      // Process each member
      const savedMembers = await Promise.all(
        members.map(async (member) => {
          // Hash the password before saving
          const hashedPassword = await bcrypt.hash(member.password, 10);
  
          // Create a new user
          const newUser = new User({
            team_code,
            full_name: member.full_name,
            title: member.title,
            email: member.email,
            role: member.role,
            password: hashedPassword,
          });
  
          // Save the user to the database
          return await newUser.save();
        })
      );
      
      res.status(200).json({ success: true, message: 'Members imported successfully', data: savedMembers });
    } catch (error) {
      console.error('Error importing members:', error);
  
      // Handle duplicate email error
      if (error.code === 11000) {
        return res.status(409).json({ success: false, message: 'A user with this email already exists' });
      }
  
      res.status(500).json({ success: false, message: 'Failed to import members' });
    }
  };