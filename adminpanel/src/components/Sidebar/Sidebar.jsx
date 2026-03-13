import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { assets } from '../../assets/assets';

const navItems = [
  { to: '/add',    icon: 'bi-plus-circle-fill', label: 'Add Food',  emoji: '➕' },
  { to: '/list',   icon: 'bi-grid-fill',        label: 'Food Menu', emoji: '🍱' },
  { to: '/orders', icon: 'bi-bag-check-fill',   label: 'Orders',    emoji: '📦' },
];

const Sidebar = ({ sidebarVisible }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/list') return location.pathname === '/list' || location.pathname === '/';
    return location.pathname === path;
  };

  return (
    <div
      className={sidebarVisible ? '' : 'd-none'}
      id="sidebar-wrapper"
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo Area */}
      <div
        className="sidebar-heading border-bottom"
        style={{
          borderColor: 'var(--border-subtle)',
          padding: '0 1.25rem',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid var(--border-medium)',
          flexShrink: 0,
        }}>
          <img src={assets.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 13,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}>Dashboard</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>ADMIN PANEL</div>
        </div>
      </div>

      {/* Section Label */}
      <div style={{
        padding: '20px 16px 8px',
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
      }}>
        Navigation
      </div>

      {/* Nav Items */}
      <div className="list-group list-group-flush" style={{ padding: '0 8px', flex: 1 }}>
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className="list-group-item list-group-item-action"
              style={{
                borderRadius: 'var(--radius-md)',
                marginBottom: 4,
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                textDecoration: 'none',
                background: active ? 'rgba(255,107,43,0.1)' : 'transparent',
                color: active ? 'var(--accent-orange)' : 'var(--text-secondary)',
                border: active ? '1px solid rgba(255,107,43,0.2)' : '1px solid transparent',
                boxShadow: active ? 'var(--glow-sm)' : 'none',
                transition: 'all var(--transition)',
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'var(--bg-elevated)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {/* Icon container */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: active ? 'rgba(255,107,43,0.2)' : 'var(--bg-elevated)',
                fontSize: 14,
                flexShrink: 0,
                transition: 'background var(--transition)',
              }}>
                <i className={`bi ${item.icon}`} style={{ color: active ? 'var(--accent-orange)' : 'var(--text-secondary)', fontSize: 13 }}></i>
              </div>

              <span style={{ fontSize: 13, fontFamily: 'var(--font-body)' }}>{item.label}</span>

              {active && (
                <div style={{
                  marginLeft: 'auto',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--accent-orange)',
                  boxShadow: '0 0 6px rgba(255,107,43,0.8)',
                }} />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-subtle)',
        margin: '0 8px 8px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-elevated)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            boxShadow: 'var(--glow-sm)',
          }}>
            <i className="bi bi-person-fill" style={{ color: '#fff' }}></i>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Admin</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>admin@foodapp.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;