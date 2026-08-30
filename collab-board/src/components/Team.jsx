
import React, { useEffect, useMemo, useState } from 'react';
import socket from '../services/socket';

const API_BASE_URL = 'http://localhost:5000/api/team';

export default function Team({
  onNavigate,
  onLogout,
  theme = 'light',
}) {
  const isDark = theme === 'dark';

  // =========================================================
  // THEME
  // =========================================================
  const colors = {
    background: isDark ? '#0f172a' : '#f8fafc',
    card: isDark ? '#1e293b' : '#ffffff',
    text: isDark ? '#f8fafc' : '#1e293b',
    secondary: isDark ? '#94a3b8' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
    input: isDark ? '#0f172a' : '#ffffff',
    tableHeader: isDark ? '#0f172a' : '#f8fafc',
  };

  // =========================================================
  // STATE
  // =========================================================
  const [members, setMembers] = useState([]);
  const [onlineMemberIds, setOnlineMemberIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [currentPage, setCurrentPage] = useState(1);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] =
    useState('Frontend Developer');
  const [inviteLoading, setInviteLoading] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const [notification, setNotification] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const membersPerPage = 5;

  // =========================================================
  // ROLES
  // =========================================================
  const roles = [
    'All Roles',
    'Project Manager',
    'UI/UX Designer',
    'Frontend Developer',
    'Backend Developer',
    'Administrator',
  ];

  // =========================================================
  // AUTH HEADER
  // =========================================================
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // =========================================================
  // NOTIFICATION
  // =========================================================
  const showNotification = (message) => {
    setNotification(message);

    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  // =========================================================
  // FETCH TEAM MEMBERS
  // =========================================================
  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to load team members'
        );
      }

      const teamMembers = data.members || data || [];

      setMembers(
        teamMembers.map((member) => ({
          ...member,

          id: member._id || member.id,

          name:
            member.name ||
            member.username ||
            member.fullName ||
            'Unknown Member',

          email: member.email || '',

          role: member.role || 'Member',

          status: member.status || 'Offline',

          joined:
            member.joined ||
            member.joinedDate ||
            'Recently',

          avatar:
            member.avatar ||
            member.profileImage ||
            member.image ||
            null,
        }))
      );
    } catch (err) {
      console.error('Fetch team error:', err);

      setError(
        err.message || 'Unable to load team members'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const syncPresence = (userIds = []) => {
      setOnlineMemberIds(userIds.map((id) => String(id)));
    };

    socket.on('presence:sync', syncPresence);
    socket.emit('presence:request');
    return () => socket.off('presence:sync', syncPresence);
  }, []);

  // =========================================================
  // FILTER MEMBERS
  // =========================================================
  const filteredMembers = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return members.filter((member) => {
      const name = String(member.name || '').toLowerCase();
      const email = String(member.email || '').toLowerCase();
      const role = String(member.role || '');

      const matchesSearch =
        name.includes(search) ||
        email.includes(search);

      const matchesRole =
        selectedRole === 'All Roles' ||
        role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, selectedRole]);

  // =========================================================
  // PAGINATION
  // =========================================================
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredMembers.length / membersPerPage
    )
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const displayedMembers =
    filteredMembers.slice(
      (currentPage - 1) * membersPerPage,
      currentPage * membersPerPage
    );

  // =========================================================
  // STATISTICS
  // =========================================================
  const isMemberOnline = (member) => onlineMemberIds.includes(String(member.id));
  const memberStatus = (member) => isMemberOnline(member) ? 'Online' : member.status === 'Away' ? 'Away' : 'Offline';
  const onlineCount = members.filter(isMemberOnline).length;

  const pendingInvitations = members.filter(
    (member) =>
      member.joined === 'Pending invitation'
  ).length;

  const uniqueRoles = new Set(
    members
      .map((member) => member.role)
      .filter(Boolean)
  ).size;

  // =========================================================
  // INVITE MEMBER
  // =========================================================
  const handleInvite = async (event) => {
    event.preventDefault();

    const email = inviteEmail.trim().toLowerCase();

    if (!email) {
      showNotification('Please enter an email address.');
      return;
    }

    const alreadyExists = members.some(
      (member) =>
        String(member.email).toLowerCase() === email
    );

    if (alreadyExists) {
      showNotification(
        'This email is already a team member.'
      );
      return;
    }

    try {
      setInviteLoading(true);

      /*
       * Change this endpoint if your backend
       * uses another invitation route.
       */
      const response = await fetch(
        `${API_BASE_URL}/invite`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            email,
            role: inviteRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to send invitation'
        );
      }

      setInviteEmail('');
      setInviteRole('Frontend Developer');
      setShowInviteModal(false);

      showNotification(
        data.message ||
          `Invitation sent to ${email}`
      );

      await fetchTeamMembers();

      setCurrentPage(1);
    } catch (err) {
      console.error('Invite error:', err);

      showNotification(
        err.message ||
          'Failed to send invitation'
      );
    } finally {
      setInviteLoading(false);
    }
  };

  // =========================================================
  // REMOVE MEMBER
  // =========================================================
  const handleRemoveMember = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name} from the team?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      /*
       * Change this endpoint if your backend
       * uses another remove route.
       */
      const response = await fetch(
        `${API_BASE_URL}/${member.id}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to remove team member'
        );
      }

      setSelectedMember(null);
      setShowActionMenu(false);

      showNotification(
        data.message ||
          `${member.name} has been removed.`
      );

      await fetchTeamMembers();
    } catch (err) {
      console.error('Remove member error:', err);

      showNotification(
        err.message ||
          'Failed to remove member'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // CHANGE ROLE
  // =========================================================
  const handleChangeRole = async (member) => {
    const newRole = window.prompt(
      `Enter new role for ${member.name}:`,
      member.role
    );

    if (!newRole || !newRole.trim()) {
      return;
    }

    const cleanedRole = newRole.trim();

    if (cleanedRole === member.role) {
      setShowActionMenu(false);
      return;
    }

    try {
      setActionLoading(true);

      /*
       * Change this endpoint if your backend
       * uses another role update route.
       */
      const response = await fetch(
        `${API_BASE_URL}/${member.id}/role`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            role: cleanedRole,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'Failed to update member role'
        );
      }

      setShowActionMenu(false);

      showNotification(
        data.message ||
          `${member.name}'s role has been updated.`
      );

      await fetchTeamMembers();
    } catch (err) {
      console.error('Change role error:', err);

      showNotification(
        err.message ||
          'Failed to update role'
      );
    } finally {
      setActionLoading(false);
    }
  };

  // =========================================================
  // ACTION MENU
  // =========================================================
  const openActionMenu = (member) => {
    setSelectedMember(member);
    setShowActionMenu(true);
  };

  const closeActionMenu = () => {
    if (!actionLoading) {
      setShowActionMenu(false);
      setSelectedMember(null);
    }
  };

  // =========================================================
  // ROLE STYLE
  // =========================================================
  const roleStyle = (role) => {
    const styles = {
      'Project Manager': {
        background: isDark
          ? '#1e3a5f'
          : '#e8f1ff',
        color: isDark
          ? '#93c5fd'
          : '#2563a9',
      },

      'UI/UX Designer': {
        background: isDark
          ? '#134e4a'
          : '#e5f7f4',
        color: isDark
          ? '#5eead4'
          : '#0f766e',
      },

      'Frontend Developer': {
        background: isDark
          ? '#312e81'
          : '#eee9ff',
        color: isDark
          ? '#c4b5fd'
          : '#5b4ab1',
      },

      'Backend Developer': {
        background: isDark
          ? '#78350f'
          : '#fff5df',
        color: isDark
          ? '#fcd34d'
          : '#a16207',
      },

      Administrator: {
        background: isDark
          ? '#374151'
          : '#edf1f5',
        color: isDark
          ? '#e5e7eb'
          : '#475569',
      },
    };

    return (
      styles[role] || {
        background: isDark
          ? '#334155'
          : '#e2e8f0',
        color: isDark
          ? '#cbd5e1'
          : '#475569',
      }
    );
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================
  const statusColor = (status) => {
    if (status === 'Online') {
      return '#10b981';
    }

    if (status === 'Away') {
      return '#f59e0b';
    }

    return '#94a3b8';
  };

  // =========================================================
  // NAVIGATION STYLE
  // =========================================================
  const navigationStyle = (active = false) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 12px',
    color: active
      ? '#ffffff'
      : colors.secondary,
    background: active
      ? '#2563eb'
      : 'transparent',
    borderRadius: '9px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: active ? '600' : '500',
    transition: '0.2s',
  });

  // =========================================================
  // RENDER
  // =========================================================
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        background: colors.background,
        color: colors.text,
        fontFamily:
          'Inter, Arial, Helvetica, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside
        data-legacy-sidebar
        style={{
          width: '240px',
          minWidth: '240px',
          flexShrink: 0,
          background: colors.card,
          borderRight:
            `1px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '32px',
          }}
        >
          <span
            style={{
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#2563eb',
              color: '#ffffff',
              borderRadius: '10px',
              fontSize: '20px',
            }}
          >
            📅
          </span>

          CollabBoard
        </div>

        {/* NAVIGATION */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
            flex: 1,
          }}
        >
          <div
            onClick={() =>
              onNavigate?.('dashboard')
            }
            style={navigationStyle()}
          >
            📊 Dashboard
          </div>

          <div
            onClick={() =>
              onNavigate?.('profile')
            }
            style={navigationStyle()}
          >
            👤 Profile
          </div>

          <div
            onClick={() =>
              onNavigate?.('tasks')
            }
            style={navigationStyle()}
          >
            📋 Tasks
          </div>

          <div
            style={navigationStyle(true)}
          >
            👥 Team
          </div>

          <div
            onClick={() =>
              onNavigate?.('project-overview')
            }
            style={navigationStyle()}
          >
            📁 Project Overview
          </div>

          <div
            onClick={() =>
              onNavigate?.('setting')
            }
            style={navigationStyle()}
          >
            ⚙️ Setting
          </div>
        </nav>

        {/* LOGOUT */}
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            padding: '11px',
            background: isDark
              ? '#7f1d1d'
              : '#fee2e2',
            color: isDark
              ? '#fca5a5'
              : '#dc2626',
            border: 'none',
            borderRadius: '9px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          height: '100vh',
          overflowY: 'auto',
          boxSizing: 'border-box',
          padding: '32px 40px',
        }}
      >
        {/* NOTIFICATION */}
        {notification && (
          <div
            style={{
              position: 'fixed',
              top: '25px',
              right: '25px',
              zIndex: 3000,
              padding: '13px 18px',
              background: '#2563eb',
              color: '#ffffff',
              borderRadius: '10px',
              boxShadow:
                '0 8px 25px rgba(0,0,0,0.15)',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {notification}
          </div>
        )}

        {/* HEADER */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '700',
              }}
            >
              Team
            </h1>

            <p
              style={{
                margin: '8px 0 0',
                color: colors.secondary,
                fontSize: '15px',
              }}
            >
              Manage your team members and
              their roles.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* SEARCH */}
            <div
              style={{
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '13px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  color: colors.secondary,
                }}
              >
                🔍
              </span>

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(
                    event.target.value
                  );
                  setCurrentPage(1);
                }}
                placeholder="Search team members..."
                style={{
                  width: '280px',
                  padding:
                    '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border:
                    `1px solid ${colors.border}`,
                  background: colors.input,
                  color: colors.text,
                  outline: 'none',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* INVITE */}
            <button
              onClick={() =>
                setShowInviteModal(true)
              }
              style={{
                padding: '12px 18px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ＋ Invite Member
            </button>
          </div>
        </header>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: isDark
                ? '#450a0a'
                : '#fef2f2',
              color: isDark
                ? '#fca5a5'
                : '#dc2626',
              border:
                `1px solid ${
                  isDark
                    ? '#7f1d1d'
                    : '#fecaca'
                }`,
              padding: '14px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <span>{error}</span>

            <button
              onClick={fetchTeamMembers}
              style={{
                border: 'none',
                background: '#dc2626',
                color: '#ffffff',
                padding: '8px 13px',
                borderRadius: '7px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, minmax(0, 1fr))',
            gap: '18px',
            marginBottom: '30px',
          }}
        >
          <StatCard
            icon="👥"
            iconBg={
              isDark
                ? '#172554'
                : '#eaf2ff'
            }
            iconColor="#2563eb"
            title="Total Members"
            value={members.length}
            description="Team members"
            {...colors}
          />

          <StatCard
            icon="●"
            iconBg={
              isDark
                ? '#064e3b'
                : '#e7f8f0'
            }
            iconColor="#059669"
            title="Online Now"
            value={onlineCount}
            description="Currently online"
            {...colors}
          />

          <StatCard
            icon="♟"
            iconBg={
              isDark
                ? '#312e81'
                : '#f0ecff'
            }
            iconColor="#7c3aed"
            title="Roles"
            value={uniqueRoles}
            description="Different roles"
            {...colors}
          />

          <StatCard
            icon="✉"
            iconBg={
              isDark
                ? '#78350f'
                : '#fff6e5'
            }
            iconColor="#d97706"
            title="Invitations"
            value={pendingInvitations}
            description="Pending invitations"
            {...colors}
          />
        </div>

        {/* TEAM CARD */}
        <section
          style={{
            background: colors.card,
            border:
              `1px solid ${colors.border}`,
            borderRadius: '16px',
            padding: '20px',
            boxSizing: 'border-box',
            boxShadow: isDark
              ? 'none'
              : '0 4px 18px rgba(15,23,42,0.04)',
          }}
        >
          {/* TABLE HEADER */}
          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '18px',
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
              }}
            >
              Team Members
            </h2>

            <select
              value={selectedRole}
              onChange={(event) => {
                setSelectedRole(
                  event.target.value
                );
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '9px',
                border:
                  `1px solid ${colors.border}`,
                background: colors.input,
                color: colors.text,
                outline: 'none',
                minWidth: '170px',
                cursor: 'pointer',
              }}
            >
              {roles.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* LOADING */}
          {loading ? (
            <div
              style={{
                padding: '70px 20px',
                textAlign: 'center',
                color: colors.secondary,
              }}
            >
              <div
                style={{
                  fontSize: '35px',
                  marginBottom: '12px',
                }}
              >
                ⏳
              </div>

              <div
                style={{
                  fontWeight: '600',
                }}
              >
                Loading team members...
              </div>
            </div>
          ) : (
            <>
              {/* TABLE */}
              <div
                style={{
                  width: '100%',
                  overflowX: 'auto',
                }}
              >
                <div
                  style={{
                    minWidth: '850px',
                  }}
                >
                  {/* TABLE HEAD */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        '2.3fr 1.5fr 1fr 1.2fr 55px',
                      gap: '12px',
                      padding: '15px',
                      background:
                        colors.tableHeader,
                      borderRadius: '10px',
                      color: '#2563a9',
                      fontWeight: '600',
                      fontSize: '13px',
                    }}
                  >
                    <div>Member</div>
                    <div>Role</div>
                    <div>Status</div>
                    <div>Joined</div>
                    <div>Action</div>
                  </div>

                  {/* MEMBERS */}
                  {displayedMembers.length > 0 ? (
                    displayedMembers.map(
                      (member) => (
                        <div
                          key={member.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              '2.3fr 1.5fr 1fr 1.2fr 55px',
                            gap: '12px',
                            alignItems:
                              'center',
                            padding:
                              '18px 15px',
                            borderBottom:
                              `1px solid ${colors.border}`,
                          }}
                        >
                          {/* MEMBER */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems:
                                'center',
                              gap: '13px',
                              minWidth: 0,
                            }}
                          >
                            {member.avatar ? (
                              <img
                                src={
                                  member.avatar
                                }
                                alt={
                                  member.name
                                }
                                onError={(
                                  event
                                ) => {
                                  event.currentTarget.style.display =
                                    'none';
                                }}
                                style={{
                                  width: '48px',
                                  height: '48px',
                                  minWidth:
                                    '48px',
                                  borderRadius:
                                    '50%',
                                  objectFit:
                                    'cover',
                                }}
                              />
                            ) : (
                              <Avatar
                                name={
                                  member.name
                                }
                              />
                            )}

                            <div
                              style={{
                                minWidth: 0,
                              }}
                            >
                              <div
                                style={{
                                  fontWeight:
                                    '600',
                                  fontSize:
                                    '14px',
                                  marginBottom:
                                    '4px',
                                  overflow:
                                    'hidden',
                                  textOverflow:
                                    'ellipsis',
                                  whiteSpace:
                                    'nowrap',
                                }}
                              >
                                {
                                  member.name
                                }
                              </div>

                              <div
                                style={{
                                  color:
                                    colors.secondary,
                                  fontSize:
                                    '13px',
                                  overflow:
                                    'hidden',
                                  textOverflow:
                                    'ellipsis',
                                  whiteSpace:
                                    'nowrap',
                                }}
                              >
                                {
                                  member.email
                                }
                              </div>
                            </div>
                          </div>

                          {/* ROLE */}
                          <div>
                            <span
                              style={{
                                ...roleStyle(
                                  member.role
                                ),
                                display:
                                  'inline-block',
                                padding:
                                  '8px 11px',
                                borderRadius:
                                  '8px',
                                fontSize:
                                  '12px',
                                fontWeight:
                                  '600',
                                maxWidth:
                                  '100%',
                                overflow:
                                  'hidden',
                                textOverflow:
                                  'ellipsis',
                                whiteSpace:
                                  'nowrap',
                              }}
                            >
                              {
                                member.role
                              }
                            </span>
                          </div>

                          {/* STATUS */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems:
                                'center',
                              gap: '8px',
                              color:
                                colors.secondary,
                              fontSize:
                                '13px',
                            }}
                          >
                            <span
                              style={{
                                width: '9px',
                                height: '9px',
                                borderRadius:
                                  '50%',
                                background:
                                  statusColor(
                                    memberStatus(member)
                                  ),
                              }}
                            />

                            {
                              memberStatus(member)
                            }
                          </div>

                          {/* JOINED */}
                          <div
                            style={{
                              color:
                                colors.secondary,
                              fontSize:
                                '13px',
                              overflow:
                                'hidden',
                              textOverflow:
                                'ellipsis',
                              whiteSpace:
                                'nowrap',
                            }}
                          >
                            {
                              member.joined
                            }
                          </div>

                          {/* ACTION */}
                          <button
                            onClick={() =>
                              openActionMenu(
                                member
                              )
                            }
                            disabled={
                              actionLoading
                            }
                            style={{
                              width: '40px',
                              height: '40px',
                              border:
                                `1px solid ${colors.border}`,
                              background:
                                colors.input,
                              color:
                                colors.text,
                              borderRadius:
                                '9px',
                              fontSize:
                                '19px',
                              cursor:
                                actionLoading
                                  ? 'not-allowed'
                                  : 'pointer',
                              opacity:
                                actionLoading
                                  ? 0.5
                                  : 1,
                            }}
                          >
                            ⋮
                          </button>
                        </div>
                      )
                    )
                  ) : (
                    <div
                      style={{
                        padding:
                          '60px 20px',
                        textAlign:
                          'center',
                        color:
                          colors.secondary,
                      }}
                    >
                      <div
                        style={{
                          fontSize: '35px',
                          marginBottom:
                            '10px',
                        }}
                      >
                        👥
                      </div>

                      <div
                        style={{
                          fontWeight:
                            '600',
                          marginBottom:
                            '5px',
                        }}
                      >
                        No team members found
                      </div>

                      <div
                        style={{
                          fontSize:
                            '13px',
                        }}
                      >
                        Try changing your
                        search or role
                        filter.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PAGINATION */}
              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  gap: '15px',
                  paddingTop: '20px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    color:
                      colors.secondary,
                    fontSize: '13px',
                  }}
                >
                  Showing{' '}
                  {filteredMembers.length ===
                  0
                    ? 0
                    : (currentPage - 1) *
                        membersPerPage +
                      1}{' '}
                  to{' '}
                  {Math.min(
                    currentPage *
                      membersPerPage,
                    filteredMembers.length
                  )}{' '}
                  of{' '}
                  {filteredMembers.length}{' '}
                  members
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <PageButton
                    disabled={
                      currentPage === 1
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.max(
                            1,
                            page - 1
                          )
                      )
                    }
                    {...colors}
                  >
                    ‹
                  </PageButton>

                  {Array.from({
                    length: totalPages,
                  }).map((_, index) => {
                    const page =
                      index + 1;

                    return (
                      <PageButton
                        key={page}
                        active={
                          currentPage ===
                          page
                        }
                        onClick={() =>
                          setCurrentPage(
                            page
                          )
                        }
                        {...colors}
                      >
                        {page}
                      </PageButton>
                    );
                  })}

                  <PageButton
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        (page) =>
                          Math.min(
                            totalPages,
                            page + 1
                          )
                      )
                    }
                    {...colors}
                  >
                    ›
                  </PageButton>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* =====================================================
          INVITE MODAL
      ====================================================== */}
      {showInviteModal && (
        <div
          onClick={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              if (!inviteLoading) {
                setShowInviteModal(false);
              }
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(15,23,42,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '430px',
              maxWidth: '100%',
              background: colors.card,
              borderRadius: '16px',
              padding: '28px',
              border:
                `1px solid ${colors.border}`,
              boxSizing: 'border-box',
              boxShadow:
                '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                marginBottom: '22px',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '21px',
                  }}
                >
                  Invite Team Member
                </h2>

                <p
                  style={{
                    margin:
                      '6px 0 0',
                    color:
                      colors.secondary,
                    fontSize: '13px',
                  }}
                >
                  Send an invitation
                  to a new team member.
                </p>
              </div>

              <button
                type="button"
                disabled={
                  inviteLoading
                }
                onClick={() =>
                  setShowInviteModal(
                    false
                  )
                }
                style={{
                  border: 'none',
                  background:
                    'transparent',
                  color:
                    colors.secondary,
                  fontSize: '22px',
                  cursor:
                    inviteLoading
                      ? 'not-allowed'
                      : 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleInvite}
            >
              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Email Address
              </label>

              <input
                type="email"
                required
                value={inviteEmail}
                disabled={
                  inviteLoading
                }
                onChange={(event) =>
                  setInviteEmail(
                    event.target.value
                  )
                }
                placeholder="member@email.com"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '9px',
                  border:
                    `1px solid ${colors.border}`,
                  background:
                    colors.input,
                  color: colors.text,
                  outline: 'none',
                  marginBottom:
                    '18px',
                  boxSizing:
                    'border-box',
                }}
              />

              <label
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Role
              </label>

              <select
                value={inviteRole}
                disabled={
                  inviteLoading
                }
                onChange={(event) =>
                  setInviteRole(
                    event.target.value
                  )
                }
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '9px',
                  border:
                    `1px solid ${colors.border}`,
                  background:
                    colors.input,
                  color: colors.text,
                  outline: 'none',
                  marginBottom:
                    '25px',
                }}
              >
                {roles
                  .slice(1)
                  .map((role) => (
                    <option
                      key={role}
                      value={role}
                    >
                      {role}
                    </option>
                  ))}
              </select>

              <div
                style={{
                  display: 'flex',
                  justifyContent:
                    'flex-end',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  disabled={
                    inviteLoading
                  }
                  onClick={() => {
                    setInviteEmail('');
                    setShowInviteModal(
                      false
                    );
                  }}
                  style={{
                    padding:
                      '11px 18px',
                    borderRadius:
                      '9px',
                    border:
                      `1px solid ${colors.border}`,
                    background:
                      'transparent',
                    color: colors.text,
                    cursor:
                      inviteLoading
                        ? 'not-allowed'
                        : 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    inviteLoading
                  }
                  style={{
                    padding:
                      '11px 18px',
                    borderRadius:
                      '9px',
                    border: 'none',
                    background:
                      '#2563eb',
                    color: '#ffffff',
                    cursor:
                      inviteLoading
                        ? 'not-allowed'
                        : 'pointer',
                    fontWeight: '600',
                    opacity:
                      inviteLoading
                        ? 0.7
                        : 1,
                  }}
                >
                  {inviteLoading
                    ? 'Sending...'
                    : 'Send Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          ACTION MENU
      ====================================================== */}
      {showActionMenu &&
        selectedMember && (
          <div
            onClick={closeActionMenu}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1500,
            }}
          >
            <div
              onClick={(event) =>
                event.stopPropagation()
              }
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform:
                  'translate(-50%, -50%)',
                width: '260px',
                background:
                  colors.card,
                border:
                  `1px solid ${colors.border}`,
                borderRadius: '14px',
                padding: '10px',
                boxShadow:
                  '0 15px 40px rgba(0,0,0,0.2)',
              }}
            >
              <div
                style={{
                  padding: '12px',
                  borderBottom:
                    `1px solid ${colors.border}`,
                  marginBottom: '5px',
                }}
              >
                <div
                  style={{
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  {
                    selectedMember.name
                  }
                </div>

                <div
                  style={{
                    color:
                      colors.secondary,
                    fontSize: '12px',
                    marginTop: '4px',
                  }}
                >
                  {
                    selectedMember.email
                  }
                </div>
              </div>

              <ActionButton
                onClick={() => {
                  setShowActionMenu(
                    false
                  );

                  showNotification(
                    `Viewing ${selectedMember.name}`
                  );
                }}
                icon="👤"
                text="View Member"
                colors={colors}
              />

              <ActionButton
                onClick={() =>
                  handleChangeRole(
                    selectedMember
                  )
                }
                icon="✏️"
                text="Change Role"
                colors={colors}
              />

              <ActionButton
                danger
                onClick={() =>
                  handleRemoveMember(
                    selectedMember
                  )
                }
                icon="🗑️"
                text={
                  actionLoading
                    ? 'Processing...'
                    : 'Remove Member'
                }
                colors={colors}
              />
            </div>
          </div>
        )}
    </div>
  );
}

// =============================================================
// AVATAR
// =============================================================
function Avatar({ name }) {
  const safeName = name || 'User';

  const initials = safeName
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        minWidth: '48px',
        borderRadius: '50%',
        background: '#dbeafe',
        color: '#2563eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '15px',
      }}
    >
      {initials || 'U'}
    </div>
  );
}

// =============================================================
// STAT CARD
// =============================================================
function StatCard({
  icon,
  iconBg,
  iconColor,
  title,
  value,
  description,
  card,
  text,
  secondary,
  border,
}) {
  return (
    <div
      style={{
        background: card,
        border:
          `1px solid ${border}`,
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        minWidth: 0,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          minWidth: '54px',
          borderRadius: '15px',
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '23px',
        }}
      >
        {icon}
      </div>

      <div
        style={{
          minWidth: 0,
        }}
      >
        <div
          style={{
            color: secondary,
            fontSize: '12px',
            marginBottom: '5px',
          }}
        >
          {title}
        </div>

        <div
          style={{
            color: text,
            fontSize: '25px',
            fontWeight: '700',
          }}
        >
          {value}
        </div>

        <div
          style={{
            color: secondary,
            fontSize: '12px',
            marginTop: '3px',
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

// =============================================================
// PAGE BUTTON
// =============================================================
function PageButton({
  children,
  onClick,
  disabled,
  active,
  card,
  border,
  text,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '9px',
        border: active
          ? '1px solid #2563eb'
          : `1px solid ${border}`,
        background: active
          ? '#2563eb'
          : card,
        color: active
          ? '#ffffff'
          : text,
        cursor: disabled
          ? 'not-allowed'
          : 'pointer',
        opacity: disabled ? 0.45 : 1,
        fontWeight: '600',
        fontSize: '15px',
      }}
    >
      {children}
    </button>
  );
}

// =============================================================
// ACTION BUTTON
// =============================================================
function ActionButton({
  icon,
  text,
  onClick,
  danger = false,
  colors,
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '11px 12px',
        border: 'none',
        background: 'transparent',
        color: danger
          ? '#dc2626'
          : colors.text,
        borderRadius: '8px',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '13px',
      }}
    >
      <span>{icon}</span>
      {text}
    </button>
  );
}

