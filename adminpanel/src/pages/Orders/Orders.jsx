import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { fetchAllOrders, updateOrderStatus } from "../../services/orderService";
import { toast } from "react-toastify";

const statusConfig = {
  "Food Preparing": {
    color: '#ffb347',
    bg: 'rgba(255,179,71,0.1)',
    border: 'rgba(255,179,71,0.25)',
    icon: '🍳',
  },
  "Out for delivery": {
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.1)',
    border: 'rgba(56,189,248,0.25)',
    icon: '🛵',
  },
  "Delivered": {
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.1)',
    border: 'rgba(74,222,128,0.25)',
    icon: '✅',
  },
};

const Orders = () => {
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetchAllOrders();
      setData(response);
    } catch (error) {
      toast.error("Unable to display the orders. Please try again.");
    }
  };

  const updateStatus = async (event, orderId) => {
    const success = await updateOrderStatus(orderId, event.target.value);
    if (success) await fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cfg = (status) => statusConfig[status] || statusConfig["Food Preparing"];

  return (
    <div style={{ padding: '28px', minHeight: 'calc(100vh - 60px)' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 24,
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          Live <span style={{ color: 'var(--accent-orange)' }}>Orders</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>
          {data.length} active order{data.length !== 1 ? 's' : ''} in queue
        </p>
      </div>

      {/* Orders List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {data.length === 0 && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '60px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>📦</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No orders yet</div>
            <div style={{ fontSize: 12 }}>Orders will appear here in real time</div>
          </div>
        )}

        {data.map((order, index) => {
          const s = cfg(order.orderStatus);
          return (
            <div
              key={index}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                display: 'grid',
                gridTemplateColumns: '48px 1fr auto auto auto',
                alignItems: 'center',
                gap: 18,
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Parcel Icon */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                flexShrink: 0,
              }}>
                {s.icon}
              </div>

              {/* Order Details */}
              <div>
                <div style={{
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  marginBottom: 4,
                  lineHeight: 1.5,
                }}>
                  {order.orderedItems.map((item, i) => (
                    <span key={i}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}> ×{item.quantity}</span>
                      {i < order.orderedItems.length - 1 && <span style={{ color: 'var(--border-medium)', margin: '0 6px' }}>·</span>}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <i className="bi bi-geo-alt" style={{ fontSize: 10 }}></i>
                  {order.userAddress}
                </div>
              </div>

              {/* Amount */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 16,
                  color: 'var(--text-primary)',
                }}>
                  ₹{order.amount.toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  {order.orderedItems.length} item{order.orderedItems.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                padding: '4px 12px',
                borderRadius: 99,
                background: s.bg,
                border: `1px solid ${s.border}`,
                color: s.color,
                fontSize: 11,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                letterSpacing: '0.02em',
                flexShrink: 0,
              }}>
                {order.orderStatus}
              </div>

              {/* Status Selector */}
              <div style={{ flexShrink: 0 }}>
                <select
                  className="form-control"
                  onChange={(event) => updateStatus(event, order.id)}
                  value={order.orderStatus}
                  style={{
                    fontSize: 12,
                    padding: '6px 10px',
                    minWidth: 155,
                    cursor: 'pointer',
                  }}
                >
                  <option value="Food Preparing">Food Preparing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;