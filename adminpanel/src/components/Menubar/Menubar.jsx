import React from 'react'

const Menubar = ({ toggleSidebar }) => {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
        padding: '0 1.5rem',
        height: '60px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="container-fluid d-flex align-items-center gap-3" style={{ padding: 0 }}>
        {/* Sidebar Toggle */}
        <button
          id="sidebarToggle"
          onClick={toggleSidebar}
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition)',
            flexShrink: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--accent-orange)';
            e.currentTarget.style.color = 'var(--accent-orange)';
            e.currentTarget.style.boxShadow = 'var(--glow-sm)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border-medium)';
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <i className="bi bi-list" style={{ fontSize: 18, lineHeight: 1 }}></i>
        </button>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            background: 'var(--accent-gradient)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            boxShadow: 'var(--glow-sm)',
          }}>
            🍽️
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 16,
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
          }}>
            Food<span style={{ color: 'var(--accent-orange)' }}>Admin</span>
          </span>
        </div>

        {/* Right side badge */}
        <div className="ms-auto d-flex align-items-center gap-2">
          <div style={{
            background: 'rgba(255,107,43,0.1)',
            border: '1px solid rgba(255,107,43,0.25)',
            borderRadius: 99,
            padding: '3px 12px',
            fontSize: 11,
            color: 'var(--accent-orange)',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}>
            ● LIVE
          </div>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            fontSize: 15,
          }}>
            <i className="bi bi-person"></i>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Menubar