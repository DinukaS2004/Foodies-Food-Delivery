import { useState } from 'react';
import { assets } from '../../assets/assets';
import { addFood } from '../../services/foodService';
import { toast } from 'react-toastify';

const categories = ['Biryani', 'Cake', 'Burger', 'Pizza', 'Rolls', 'Salad', 'Ice cream'];

const AddFood = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Biryani',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error('Please select an image.');
      return;
    }

    try {
      await addFood(data, image);
      toast.success('Food added successfully.');
      setData({ name: '', description: '', price: '', category: 'Biryani' });
      setImage(null);
    } catch (error) {
      toast.error('Error adding food.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '28px 28px', minHeight: 'calc(100vh - 60px)' }}>
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 24,
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          Add New <span style={{ color: 'var(--accent-orange)' }}>Food Item</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '4px 0 0' }}>
          Fill in the details to list a new item on the menu.
        </p>
      </div>

      <div style={{ maxWidth: 520 }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '28px',
          boxShadow: '0 4px 40px rgba(0,0,0,0.3)',
        }}>
          <form onSubmit={onSubmitHandler}>

            {/* Image Upload */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 8,
              }}>
                Food Image
              </label>
              <label
                htmlFor="image"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: image ? 'auto' : 150,
                  border: `2px dashed ${image ? 'var(--accent-orange)' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-md)',
                  background: image ? 'rgba(255,107,43,0.04)' : 'var(--bg-elevated)',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  overflow: 'hidden',
                  padding: image ? 0 : '20px',
                }}
                onMouseEnter={e => { if (!image) e.currentTarget.style.borderColor = 'var(--accent-orange)'; }}
                onMouseLeave={e => { if (!image) e.currentTarget.style.borderColor = 'var(--border-medium)'; }}
              >
                {image ? (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                  />
                ) : (
                  <>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'rgba(255,107,43,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}>
                      <i className="bi bi-cloud-arrow-up" style={{ fontSize: 22, color: 'var(--accent-orange)' }}></i>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Click to upload image</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>PNG, JPG up to 10MB</span>
                  </>
                )}
              </label>
              <input
                type="file"
                id="image"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  style={{
                    marginTop: 8,
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-red)',
                    fontSize: 12,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>Remove image
                </button>
              )}
            </div>

            {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="name" className="form-label">Name</label>
              <input
                type="text"
                placeholder="e.g. Chicken Biryani"
                className="form-control"
                id="name"
                name="name"
                required
                onChange={onChangeHandler}
                value={data.name}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="Describe this dish..."
                id="description"
                rows={4}
                required
                name="description"
                onChange={onChangeHandler}
                value={data.description}
                style={{ resize: 'none' }}
              />
            </div>

            {/* Category + Price Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  name="category"
                  id="category"
                  className="form-control"
                  onChange={onChangeHandler}
                  value={data.category}
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="price" className="form-label">Price (Rs)</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="200"
                  className="form-control"
                  onChange={onChangeHandler}
                  value={data.price}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px', fontSize: 14, fontWeight: 600, letterSpacing: '0.03em' }}
            >
              <i className="bi bi-plus-circle me-2"></i>Add Food Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFood;