const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const protect = require('../middleware/auth');
const User = require('../models/User');

// ============================================================
// CONSTANTS
// ============================================================

const VALID_ROLES = [
  'Project Manager',
  'UI/UX Designer',
  'Frontend Developer',
  'Backend Developer',
  'Administrator'
];

const VALID_STATUSES = [
  'Online',
  'Offline',
  'Away'
];

// ============================================================
// HELPER: GET CURRENT USER ID
// ============================================================

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.userId;
};

// ============================================================
// HELPER: FORMAT USER
// ============================================================

const formatMember = (user) => {
  if (!user) {
    return null;
  }

  return {
    id: user._id,
    name:
      user.name ||
      user.username ||
      user.email?.split('@')[0] ||
      'User',

    email: user.email,

    role: VALID_ROLES.includes(user.role)
      ? user.role
      : 'Frontend Developer',

    status: VALID_STATUSES.includes(user.status)
      ? user.status
      : 'Offline',

    joined:
      user.joined ||
      formatJoinedDate(user.createdAt),

    avatar: user.avatar || null
  };
};

// ============================================================
// HELPER: FORMAT JOINED DATE
// ============================================================

function formatJoinedDate(date) {
  if (!date) {
    return 'Unknown';
  }

  const joinedDate = new Date(date);

  if (Number.isNaN(joinedDate.getTime())) {
    return 'Unknown';
  }

  return joinedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// ============================================================
// GET ALL TEAM MEMBERS
// GET /api/team
// ============================================================

router.get('/', protect, async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication failed'
      });
    }

    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });

    const members = users.map(formatMember);

    return res.status(200).json({
      success: true,
      count: members.length,
      members
    });

  } catch (error) {
    console.error('GET TEAM MEMBERS ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load team members'
    });
  }
});

// ============================================================
// GET SINGLE TEAM MEMBER
// GET /api/team/:id
// ============================================================

router.get('/:id', protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team member ID'
      });
    }

    const member = await User.findById(req.params.id)
      .select('-password');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    return res.status(200).json({
      success: true,
      member: formatMember(member)
    });

  } catch (error) {
    console.error('GET TEAM MEMBER ERROR:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load team member'
    });
  }
});

// ============================================================
// INVITE TEAM MEMBER
// POST /api/team/invite
// ============================================================

router.post('/invite', protect, async (req, res) => {
  try {
    const { email, role } = req.body;

    // --------------------------------------------------------
    // VALIDATE EMAIL
    // --------------------------------------------------------

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    // Basic email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // --------------------------------------------------------
    // VALIDATE ROLE
    // --------------------------------------------------------

    const selectedRole =
      typeof role === 'string' &&
      VALID_ROLES.includes(role.trim())
        ? role.trim()
        : 'Frontend Developer';

    // --------------------------------------------------------
    // CHECK EXISTING USER
    // --------------------------------------------------------

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          'This email is already registered'
      });
    }

    // --------------------------------------------------------
    // IMPORTANT
    // --------------------------------------------------------
    //
    // Do NOT create a User here if your User model
    // requires a password.
    //
    // This route should be connected to a real
    // Invitation model/email system.
    //
    // For now, return an invitation response.
    // --------------------------------------------------------

    const generatedName = normalizedEmail
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

    return res.status(201).json({
      success: true,
      message:
        `Invitation prepared for ${normalizedEmail}`,

      invitation: {
        email: normalizedEmail,
        name: generatedName,
        role: selectedRole,
        status: 'Offline',
        joined: 'Pending invitation',
        avatar: null
      }
    });

  } catch (error) {
    console.error(
      'INVITE TEAM MEMBER ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to invite team member'
    });
  }
});

// ============================================================
// CHANGE MEMBER ROLE
// PUT /api/team/:id/role
// ============================================================

router.put('/:id/role', protect, async (req, res) => {
  try {
    const { role } = req.body;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team member ID'
      });
    }

    // --------------------------------------------------------
    // VALIDATE ROLE
    // --------------------------------------------------------

    if (!role || typeof role !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    const newRole = role.trim();

    if (!VALID_ROLES.includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // --------------------------------------------------------
    // FIND MEMBER
    // --------------------------------------------------------

    const member = await User.findById(
      req.params.id
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // --------------------------------------------------------
    // UPDATE ROLE
    // --------------------------------------------------------

    member.role = newRole;

    await member.save();

    return res.status(200).json({
      success: true,
      message:
        `${member.name || member.email}'s role has been updated`,
      member: formatMember(member)
    });

  } catch (error) {
    console.error(
      'CHANGE ROLE ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to change member role'
    });
  }
});

// ============================================================
// UPDATE MEMBER STATUS
// PUT /api/team/:id/status
// ============================================================

router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;

    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team member ID'
      });
    }

    // --------------------------------------------------------
    // VALIDATE STATUS
    // --------------------------------------------------------

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // --------------------------------------------------------
    // FIND MEMBER
    // --------------------------------------------------------

    const member = await User.findById(
      req.params.id
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // --------------------------------------------------------
    // UPDATE STATUS
    // --------------------------------------------------------

    member.status = status;

    await member.save();

    return res.status(200).json({
      success: true,
      message: 'Member status updated',
      member: formatMember(member)
    });

  } catch (error) {
    console.error(
      'UPDATE STATUS ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to update member status'
    });
  }
});

// ============================================================
// REMOVE TEAM MEMBER
// DELETE /api/team/:id
// ============================================================

router.delete('/:id', protect, async (req, res) => {
  try {
    // --------------------------------------------------------
    // VALIDATE ID
    // --------------------------------------------------------

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team member ID'
      });
    }

    // --------------------------------------------------------
    // FIND MEMBER
    // --------------------------------------------------------

    const member = await User.findById(
      req.params.id
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // --------------------------------------------------------
    // PREVENT CURRENT USER FROM DELETING THEMSELVES
    // --------------------------------------------------------

    const currentUserId = getUserId(req);

    if (
      currentUserId &&
      member._id.toString() ===
        currentUserId.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          'You cannot remove your own account from the team'
      });
    }

    const memberName =
      member.name ||
      member.username ||
      member.email;

    // --------------------------------------------------------
    // DELETE
    // --------------------------------------------------------

    await User.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message:
        `${memberName} has been removed`
    });

  } catch (error) {
    console.error(
      'REMOVE TEAM MEMBER ERROR:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to remove team member'
    });
  }
});

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;

