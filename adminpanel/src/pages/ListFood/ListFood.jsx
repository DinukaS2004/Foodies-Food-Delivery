import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./ListFood.css";
import { deleteFood, getFoodList } from "../../services/foodService";

const ListFood = () => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch (error) {
      toast.error("Error while reading the foods.");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const success = await deleteFood(foodId);
      if (success) {
        toast.success("Food removed.");
        await fetchList();
      } else {
        toast.error("Error occurred while removing the food.");
      }
    } catch (error) {
      toast.error("Error occurred while removing the food.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="food-table-wrapper">
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 24,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            Food <span style={{ color: 'var(--accent-orange)' }}>Menu</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>
            {list.length} item{list.length !== 1 ? 's' : ''} listed
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 99,
          background: 'rgba(255,107,43,0.08)',
          border: '1px solid rgba(255,107,43,0.2)',
          fontSize: 12,
          color: 'var(--accent-orange)',
          fontWeight: 600,
        }}>
          <i className="bi bi-grid-fill" style={{ fontSize: 11 }}></i>
          All Items
        </div>
      </div>

      {/* Table Card */}
      <div className="food-table-card">
        {list.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🍽️</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No food items yet</div>
            <div style={{ fontSize: 12 }}>Add your first item to get started</div>
          </div>
        ) : (
          <table className="table food-table mb-0">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="food-img"
                    />
                  </td>
                  <td>
                    <span className="food-name">{item.name}</span>
                  </td>
                  <td>
                    <span className="food-category-badge">{item.category}</span>
                  </td>
                  <td>
                    <span className="food-price">Rs {item.price}.00</span>
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => removeFood(item.id)}
                      title="Delete item"
                    >
                      <i className="bi bi-trash3" style={{ fontSize: 13 }}></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ListFood;