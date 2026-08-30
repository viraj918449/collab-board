import React, { useEffect, useState } from 'react';
import { fetchRecentActivities } from '../services/api';

export default function ActivityHistory({ onNavigate, onLogout, theme = 'light' }) {
  const isDark = theme === 'dark';

  const mainBg = isDark ? '#0f172a' : '#f8fafc';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f8fafc' : '#1e293b';
  const subTextColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#ffffff';

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const icons = {
    task_created: '+',
    task_moved: '?',
    task_updated: '?',
    task_deleted: '??',
    task_assigned: '?',
    default: '•',
  };

  const iconColors = {
    task_created: '#3b82f6',
    task_moved: '#3b82f6',
    task_updated: '#475569',
    task_deleted: '#ef4444',
    task_assigned: '#3b82f6',
    default: '#64748b',
  };

  const iconBackgrounds = {
    task_created: isDark ? '#1e3a8a' : '#eff6ff',
    task_moved: isDark ? '#1e3a8a' : '#eff6ff',
    task_updated: isDark ? '#334155' : '#f1f5f9',
    task_deleted: isDark ? '#7f1d1d' : '#fee2e2',
    task_assigned: isDark ? '#1e3a8a' : '#eff6ff',
    default: isDark ? '#334155' : '#f1f5f9',
  };

  useEffect(() => {
    let active = true;

    const loadActivities = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetchRecentActivities(50);

        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.activities || [];

        if (active) {
          setActivities(data);
        }
      } catch (err) {
        console.error('Failed to load activities:', err);

        if (active) {
          setError(
            err.response?.data?.message ||
            'Failed to load activities from backend.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadActivities();

    return () => {
      active = false;
    };
  }, []);

  const formatTime = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const now = new Date();
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }

    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatActivityMessage = (activity) => {
    if (activity.message) {
      return activity.message
        .replace(/â€œ/g, '"')
        .replace(/â€/g, '"')
        .replace(/â€/g, '"')
        .replace(/â€™/g, "'")
        .replace(/â€“/g, '-');
    }

    return activity.type || 'Activity occurred';
  };

  const getActorName = (activity) => {
    return activity.actor?.name || 'Unknown user';
  };

  const getAvatar = (activity) => {
    return activity.actor?.avatar || '';
  };

  const getInitial = (activity) => {
    const name = getActorName(activity);
    return name.charAt(0).toUpperCase();
  };

  const getProjectName = (activity) => {
    return activity.board?.name || 'Project';
  };

  const getIcon = (activity) => {
    return icons[activity.type] || icons.default;
  };

  const getIconColor = (activity) => {
    return iconColors[activity.type] || iconColors.default;
  };

  const getIconBackground = (activity) => {
    return iconBackgrounds[activity.type] || iconBackgrounds.default;
  };

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayActivities = activities.filter((activity) => {
    const date = new Date(activity.createdAt);
    return date >= todayStart;
  });

  const olderActivities = activities.filter((activity) => {
    const date = new Date(activity.createdAt);
    return date < todayStart;
  });

  const ActivityRow = ({ activity }) => {
    const avatar = getAvatar(activity);
    const actorName = getActorName(activity);

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: getIconBackground(activity),
              color: getIconColor(activity),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontWeight: 'bold',
              flexShrink: 0,
            }}
          >
            {getIcon(activity)}
          </div>

          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              background: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt={actorName}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              getInitial(activity)
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '14px',
                color: textColor,
                lineHeight: '1.4',
              }}
            >
              <strong>{actorName}</strong>{' '}
              {formatActivityMessage(activity)}
            </div>

            <div
              style={{
                fontSize: '12px',
                color: subTextColor,
                marginTop: '4px',
              }}
            >
              Project: {getProjectName(activity)}
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: '12px',
            color: subTextColor,
            whiteSpace: 'nowrap',
            paddingTop: '10px',
            marginLeft: '20px',
          }}
        >
          {formatTime(activity.createdAt)}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: mainBg,
        fontFamily: 'sans-serif',
        boxSizing: 'border-box',
        color: textColor,
      }}
    >
      <div
        style={{
          width: '240px',
          background: cardBg,
          borderRight: `1px solid ${borderColor}`,
          display: 'none',
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
            color: textColor,
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
            ??
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
            style={{
              padding: '10px 12px',
              color: subTextColor,
              cursor: 'pointer',
            }}
          >
            ?? Dashboard
          </div>

          <div
            onClick={() => onNavigate('profile')}
            style={{
              padding: '10px 12px',
              color: subTextColor,
              cursor: 'pointer',
            }}
          >
            ?? Profile
          </div>

          <div
            onClick={() => onNavigate('tasks')}
            style={{
              padding: '10px 12px',
              color: subTextColor,
              cursor: 'pointer',
            }}
          >
            ?? Tasks
          </div>

          <div
            onClick={() => onNavigate('team')}
            style={{
              padding: '10px 12px',
              color: subTextColor,
              cursor: 'pointer',
            }}
          >
            ?? Team
          </div>

          <div
            onClick={() => onNavigate('project-overview')}
            style={{
              padding: '10px 12px',
              color: subTextColor,
              cursor: 'pointer',
            }}
          >
            ?? Project Overview
          </div>

          <div
            onClick={() => onNavigate('schedule')}
            style={{
              padding: '10px 12px',
              color: subTextColor,
              cursor: 'pointer',
            }}
          >
            ?? Schedule
          </div>

          <div
            onClick={() => onNavigate('setting')}
            style={{
              padding: '10px 12px',
              color: subTextColor,
              cursor: 'pointer',
            }}
          >
            ?? Settings
          </div>
        </div>

        <button
          onClick={onLogout}
          style={{
            marginTop: 'auto',
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
          padding: '32px 48px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '24px',
          }}
        >
          <div>
            <h1
              style={{
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: 'bold',
                color: textColor,
              }}
            >
              Activity History
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: subTextColor,
              }}
            >
              Track all the important actions across your tasks and projects.
            </p>
          </div>

          <div
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#2563eb',
            }}
          >
            {new Date().toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '24px',
          }}
        >
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 16px',
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '8px',
              color: textColor,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Refresh
          </button>
        </div>

        <div
          style={{
            background: cardBg,
            border: `1px solid ${borderColor}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {loading && (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: subTextColor,
              }}
            >
              Loading activities from backend...
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#dc2626',
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && activities.length === 0 && (
            <div
              style={{
                padding: '50px',
                textAlign: 'center',
                color: subTextColor,
              }}
            >
              No activities yet.
            </div>
          )}

          {!loading && !error && todayActivities.length > 0 && (
            <>
              <h3
                style={{
                  margin: 0,
                  padding: '24px 24px 8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: textColor,
                }}
              >
                Today
              </h3>

              {todayActivities.map((activity) => (
                <ActivityRow
                  key={activity._id}
                  activity={activity}
                />
              ))}
            </>
          )}

          {!loading && !error && olderActivities.length > 0 && (
            <>
              <h3
                style={{
                  margin: 0,
                  padding: '24px 24px 8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: textColor,
                }}
              >
                Previous
              </h3>

              {olderActivities.map((activity) => (
                <ActivityRow
                  key={activity._id}
                  activity={activity}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

