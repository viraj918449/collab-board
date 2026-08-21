import React, { useMemo, useState } from 'react';

export default function Team({ onNavigate, onLogout, theme = 'light' }) {
  const isDark = theme === 'dark';

  const bgColor = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#ffffff';

  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Kasun Perera',
      email: 'kasun.perera@collaboard.com',
      role: 'Project Manager',
      status: 'Online',
      joined: 'Jan 12, 2024',
      avatar:
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    },
    {
      id: 2,
      name: 'Nethmi Fernando',
      email: 'nethmi.fernando@collaboard.com',
      role: 'UI/UX Designer',
      status: 'Online',
      joined: 'Jan 15, 2024',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      id: 3,
      name: 'Tharindu Silva',
      email: 'tharindu.silva@collaboard.com',
      role: 'Frontend Developer',
      status: 'Online',
      joined: 'Jan 18, 2024',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    {
      id: 4,
      name: 'Sachini Kumari',
      email: 'sachini.kumari@collaboard.com',
      role: 'Backend Developer',
      status: 'Away',
      joined: 'Jan 20, 2024',
      avatar:
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150',
    },
    {
      id: 5,
      name: 'Dulani Jayasinghe',
      email: 'dulani.jayasinghe@collaboard.com',
      role: 'UI/UX Designer',
      status: 'Online',
      joined: 'Feb 02, 2024',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    {
      id: 6,
      name: 'Kavinda Rathnayake',
      email: 'kavinda.rathnayake@collaboard.com',
      role: 'Frontend Developer',
      status: 'Away',
      joined: 'Feb 10, 2024',
      avatar:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
    {
      id: 7,
      name: 'Chathura Weerasinghe',
      email: 'chathura.weerasinghe@collaboard.com',
      role: 'Backend Developer',
      status: 'Offline',
      joined: 'Feb 15, 2024',
      avatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [currentPage, setCurrentPage] = useState(1);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend Developer');

  const membersPerPage = 4;

  const roles = [
    'All Roles',
    'Project Manager',
    'UI/UX Designer',
    'Frontend Developer',
    'Backend Developer',
    'Administrator',
  ];

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const search = searchQuery.toLowerCase();

      const matchesSearch =
        member.name.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search);

      const matchesRole =
        selectedRole === 'All Roles' || member.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [members, searchQuery, selectedRole]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / membersPerPage)
  );

  const displayedMembers = filteredMembers.slice(
    (currentPage - 1) * membersPerPage,
    currentPage * membersPerPage
  );

  const onlineCount = members.filter(
    (member) => member.status === 'Online'
  ).length;

  const uniqueRoles = new Set(members.map((member) => member.role)).size;

  const handleInvite = (e) => {
    e.preventDefault();

    if (!inviteEmail.trim()) return;

    const newMember = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Offline',
      joined: 'Pending invitation',
      avatar: null,
    };

    setMembers((previousMembers) => [...previousMembers, newMember]);
    setInviteEmail('');
    setShowInviteModal(false);

    alert(`Invitation sent to ${newMember.email}`);
  };

  const roleStyle = (role) => {
    const styles = {
      'Project Manager': {
        background: isDark ? '#1e3a5f' : '#e8f1ff',
        color: '#2563a9',
      },
      'UI/UX Designer': {
        background: isDark ? '#134e4a' : '#e5f7f4',
        color: '#0f766e',
      },
      'Frontend Developer': {
        background: isDark ? '#312e81' : '#eee9ff',
        color: '#5b4ab1',
      },
      'Backend Developer': {
        background: isDark ? '#78350f' : '#fff5df',
        color: '#a16207',
      },
      Administrator: {
        background: isDark ? '#374151' : '#edf1f5',
        color: isDark ? '#e5e7eb' : '#475569',
      },
    };

    return (
      styles[role] || {
        background: '#e2e8f0',
        color: '#475569',
      }
    );
  };

  const statusColor = (status) => {
    if (status === 'Online') return '#10b981';
    if (status === 'Away') return '#f59e0b';
    return '#94a3b8';
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
        background: bgColor,
        fontFamily: 'sans-serif',
        color: textColor,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '240px',
          minWidth: '240px',
          flexShrink: 0,
          background: cardBg,
          borderRight: `1px solid ${borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '30px',
          }}
        >
          <span
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '6px',
              borderRadius: '8px',
            }}
          >
            📅
          </span>
          CollabBoard
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
          }}
        >
          <div
            onClick={() => onNavigate('dashboard')}
            style={navStyle(subTextColor)}
          >
            📊 Dashboard
          </div>

          <div
            onClick={() => onNavigate('profile')}
            style={navStyle(subTextColor)}
          >
            👤 Profile
          </div>

          <div
            onClick={() => onNavigate('tasks')}
            style={navStyle(subTextColor)}
          >
            📋 Tasks
          </div>

          <div
            style={{
              ...navStyle('white'),
              background: '#2563eb',
              fontWeight: '600',
            }}
          >
            👥 Team
          </div>

          <div
            onClick={() => onNavigate('project-overview')}
            style={navStyle(subTextColor)}
          >
            📁 Project Overview
          </div>

          <div
            onClick={() => onNavigate('setting')}
            style={navStyle(subTextColor)}
          >
            ⚙️ Setting
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: '10px',
            background: isDark ? '#7f1d1d' : '#fee2e2',
            color: isDark ? '#fca5a5' : '#dc2626',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          width: 0,
          maxWidth: '100%',
          height: '100vh',
          padding: '32px 40px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '20px',
            marginBottom: '30px',
            maxWidth: '100%',
            minWidth: 0,
          }}
        >
          <div style={{ minWidth: 0 }}>
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
                color: subTextColor,
                fontSize: '16px',
              }}
            >
              Manage your team members and their roles.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              minWidth: 0,
              flexShrink: 1,
            }}
          >
            <div
              style={{
                position: 'relative',
                minWidth: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: subTextColor,
                }}
              >
                🔍
              </span>

              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search team members..."
                style={{
                  width: '280px',
                  maxWidth: '100%',
                  padding: '12px 14px 12px 40px',
                  borderRadius: '10px',
                  border: `1px solid ${borderColor}`,
                  background: inputBg,
                  color: textColor,
                  outline: 'none',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              onClick={() => setShowInviteModal(true)}
              style={{
                padding: '12px 20px',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              ＋ Invite Member
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: '18px',
            marginBottom: '30px',
            width: '100%',
            minWidth: 0,
          }}
        >
          <StatCard
            icon="👥"
            iconBg="#eaf2ff"
            iconColor="#2563eb"
            title="Total Members"
            value={members.length}
            description="Active team members"
            cardBg={cardBg}
            textColor={textColor}
            subTextColor={subTextColor}
            borderColor={borderColor}
          />

          <StatCard
            icon="♙"
            iconBg="#e7f8f0"
            iconColor="#059669"
            title="Online Now"
            value={onlineCount}
            description="Currently online"
            cardBg={cardBg}
            textColor={textColor}
            subTextColor={subTextColor}
            borderColor={borderColor}
          />

          <StatCard
            icon="♔"
            iconBg="#f0ecff"
            iconColor="#7c3aed"
            title="Roles"
            value={uniqueRoles}
            description="Different roles"
            cardBg={cardBg}
            textColor={textColor}
            subTextColor={subTextColor}
            borderColor={borderColor}
          />

          <StatCard
            icon="♧"
            iconBg="#fff6e5"
            iconColor="#d97706"
            title="Invitations"
            value="2"
            description="Pending invitations"
            cardBg={cardBg}
            textColor={textColor}
            subTextColor={subTextColor}
            borderColor={borderColor}
          />
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '16px',
            padding: '20px',
            width: '100%',
            maxWidth: '100%',
            minWidth: 0,
            boxSizing: 'border-box',
            overflow: 'hidden',
            boxShadow: isDark
              ? 'none'
              : '0 4px 18px rgba(15, 23, 42, 0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '15px',
              marginBottom: '18px',
              minWidth: 0,
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
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '9px',
                border: `1px solid ${borderColor}`,
                background: inputBg,
                color: textColor,
                outline: 'none',
                minWidth: '165px',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'minmax(0, 2.2fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1.1fr) 50px',
              gap: '10px',
              width: '100%',
              padding: '16px',
              background: isDark ? '#0f172a' : '#f8fafc',
              borderRadius: '10px',
              color: '#2563a9',
              fontWeight: '600',
              fontSize: '14px',
              boxSizing: 'border-box',
              minWidth: 0,
            }}
          >
            <div>Member</div>
            <div>Role</div>
            <div>Status</div>
            <div>Joined</div>
            <div>Actions</div>
          </div>

          {displayedMembers.length > 0 ? (
            displayedMembers.map((member) => (
              <div
                key={member.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'minmax(0, 2.2fr) minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1.1fr) 50px',
                  gap: '10px',
                  width: '100%',
                  minWidth: 0,
                  alignItems: 'center',
                  padding: '20px 8px',
                  borderBottom: `1px solid ${borderColor}`,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    minWidth: 0,
                    overflow: 'hidden',
                  }}
                >
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      style={{
                        width: '52px',
                        height: '52px',
                        minWidth: '52px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        minWidth: '52px',
                        borderRadius: '50%',
                        background: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '20px',
                        color: '#64748b',
                      }}
                    >
                      {member.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div
                    style={{
                      minWidth: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: '600',
                        fontSize: '15px',
                        marginBottom: '5px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {member.name}
                    </div>

                    <div
                      style={{
                        color: subTextColor,
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {member.email}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    minWidth: 0,
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      ...roleStyle(member.role),
                      padding: '9px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'inline-block',
                      maxWidth: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      boxSizing: 'border-box',
                    }}
                  >
                    {member.role}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    color: subTextColor,
                    fontSize: '14px',
                    minWidth: 0,
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      minWidth: '10px',
                      borderRadius: '50%',
                      background: statusColor(member.status),
                    }}
                  />

                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {member.status}
                  </span>
                </div>

                <div
                  style={{
                    color: subTextColor,
                    fontSize: '14px',
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {member.joined}
                </div>

                <button
                  onClick={() => alert(`Actions for ${member.name}`)}
                  style={{
                    width: '42px',
                    height: '42px',
                    minWidth: '42px',
                    border: `1px solid ${borderColor}`,
                    background: inputBg,
                    color: textColor,
                    borderRadius: '10px',
                    fontSize: '20px',
                    cursor: 'pointer',
                  }}
                >
                  ⋮
                </button>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '50px',
                color: subTextColor,
              }}
            >
              No team members found.
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '20px',
              gap: '15px',
              flexWrap: 'wrap',
              minWidth: 0,
            }}
          >
            <div
              style={{
                color: subTextColor,
                fontSize: '14px',
              }}
            >
              Showing{' '}
              {filteredMembers.length === 0
                ? 0
                : (currentPage - 1) * membersPerPage + 1}{' '}
              to{' '}
              {Math.min(
                currentPage * membersPerPage,
                filteredMembers.length
              )}{' '}
              of {filteredMembers.length} members
            </div>

            <div
              style={{
                display: 'flex',
                gap: '10px',
              }}
            >
              <PageButton
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={currentPage === 1}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
              >
                ‹
              </PageButton>

              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;

                return (
                  <PageButton
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    active={currentPage === page}
                    cardBg={cardBg}
                    borderColor={borderColor}
                    textColor={textColor}
                  >
                    {page}
                  </PageButton>
                );
              })}

              <PageButton
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
              >
                ›
              </PageButton>
            </div>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
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
              width: '420px',
              maxWidth: '100%',
              background: cardBg,
              borderRadius: '16px',
              padding: '28px',
              border: `1px solid ${borderColor}`,
              boxSizing: 'border-box',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Invite Team Member</h2>

            <form onSubmit={handleInvite}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Email Address
              </label>

              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="member@email.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  boxSizing: 'border-box',
                  borderRadius: '9px',
                  border: `1px solid ${borderColor}`,
                  background: inputBg,
                  color: textColor,
                  marginBottom: '18px',
                  outline: 'none',
                }}
              />

              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Role
              </label>

              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  boxSizing: 'border-box',
                  borderRadius: '9px',
                  border: `1px solid ${borderColor}`,
                  background: inputBg,
                  color: textColor,
                  marginBottom: '24px',
                }}
              >
                {roles.slice(1).map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  style={{
                    padding: '11px 18px',
                    borderRadius: '9px',
                    border: `1px solid ${borderColor}`,
                    background: 'transparent',
                    color: textColor,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: '11px 18px',
                    borderRadius: '9px',
                    border: 'none',
                    background: '#2563eb',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function navStyle(color) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    color,
    borderRadius: '8px',
    cursor: 'pointer',
  };
}

function StatCard({
  icon,
  iconBg,
  iconColor,
  title,
  value,
  description,
  cardBg,
  textColor,
  subTextColor,
  borderColor,
}) {
  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${borderColor}`,
        borderRadius: '14px',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        minWidth: 0,
        overflow: 'hidden',
        boxSizing: 'border-box',
        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.03)',
      }}
    >
      <div
        style={{
          width: '58px',
          height: '58px',
          minWidth: '58px',
          borderRadius: '18px',
          background: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '26px',
        }}
      >
        {icon}
      </div>

      <div
        style={{
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            color: subTextColor,
            marginBottom: '7px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: '26px',
            fontWeight: '700',
            color: textColor,
          }}
        >
          {value}
        </div>

        <div
          style={{
            fontSize: '13px',
            color: subTextColor,
            marginTop: '5px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}

function PageButton({
  children,
  onClick,
  disabled,
  active,
  cardBg,
  borderColor,
  textColor,
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '42px',
        height: '42px',
        minWidth: '42px',
        borderRadius: '10px',
        border: active ? '1px solid #2563eb' : `1px solid ${borderColor}`,
        background: active ? '#2563eb' : cardBg,
        color: active ? 'white' : textColor,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontWeight: '600',
        fontSize: '16px',
      }}
    >
      {children}
    </button>
  );
}