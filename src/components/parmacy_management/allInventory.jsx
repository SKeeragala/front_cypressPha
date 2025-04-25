import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function AllInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [lowStockItems, setLowStockItems] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    medicineName: "",
    category: "",
    price: "",
    quantity: "",
    expiryDate: "",
    supplier: ""
  });

  const CATEGORY_OPTIONS = [
    "Gastrointestinal", "Respiratory", "Cardiovascular", 
    "Vitamins", "Painkillers", "Antibiotics"
  ];
  
  const SUPPLIER_OPTIONS = [
    "Local Distributors", "Global Meds", 
    "HealthLife", "MediSupply", "Pharma Inc"
  ];

  useEffect(() => {
    axios.get("http://localhost:8070/inventory/in")
      .then((response) => {
        const data = response.data;
        setInventory(data);
        setLowStockItems(data.filter(item => item.quantity < 25));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching inventory:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8070/inventory/deletein/${id}`)
      .then(() => {
        const updated = inventory.filter(item => item._id !== id);
        setInventory(updated);
        setLowStockItems(updated.filter(item => item.quantity < 25));
        Swal.fire({ icon: 'success', title: 'Inventory Deleted', showConfirmButton: false });
      })
      .catch(err => console.error("Error deleting:", err));
  };

  const handleEdit = (item) => {
    setEditingItem(item._id);
    setFormData({ 
      ...item, 
      expiryDate: item.expiryDate.split('T')[0],
      price: item.price.toString(),
      quantity: item.quantity.toString()
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8070/inventory/updatein/${editingItem}`, formData)
      .then(() => {
        const updated = inventory.map(item => 
          item._id === editingItem ? { ...item, ...formData } : item
        );
        setInventory(updated);
        setLowStockItems(updated.filter(item => item.quantity < 25));
        setEditingItem(null);
        Swal.fire({ icon: 'success', title: 'Inventory Updated', showConfirmButton: false });
      })
      .catch(err => console.error("Update error:", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Group inventory by category
  const categorizedInventory = {};
  CATEGORY_OPTIONS.forEach(category => {
    const items = inventory.filter(item => item.category === category);
    if (items.length > 0) {
      categorizedInventory[category] = items;
    }
  });

  return (
    <div style={{ background: 'linear-gradient(to bottom right, #fecaca, #e0f2fe)', padding: '24px' }}>
      <div style={{ maxWidth: '1200px', margin: 'auto', backgroundColor: '#f3f4f6', padding: '24px', position: 'relative' }}>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fee2e2', borderLeft: '4px solid #ef4444' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#b91c1c' }}>Low Stock Alert!</h3>
            <p style={{ color: '#dc2626' }}>
              {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} below 25 in stock
            </p>
            <ul style={{ color: '#ef4444', fontSize: '14px', marginTop: '8px' }}>
              {lowStockItems.map(item => (
                <li key={item._id}>• {item.medicineName} - Current Stock: {item.quantity}</li>
              ))}
            </ul>
          </div>
        )}

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>Inventory Management</h2>

        {/* Edit Modal */}
        {editingItem && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000
          }}>
            <form 
              onSubmit={handleUpdate}
              style={{
                backgroundColor: 'white', padding: '32px', borderRadius: '12px', width: '600px',
                position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
            >
              <button onClick={() => setEditingItem(null)} type="button"
                style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '18px', color: '#4b5563' }}>
                ✕
              </button>
              <h3 style={{ fontSize: '22px', fontWeight: '700', textAlign: 'center', marginBottom: '24px' }}>Update Inventory Item</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label>Medicine Name</label>
                  <input name="medicineName" value={formData.medicineName} onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
                </div>
                <div>
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} required>
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Price (LKR)</label>
                  <input name="price" type="number" value={formData.price} onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
                </div>
                <div>
                  <label>Quantity</label>
                  <input name="quantity" type="number" value={formData.quantity} onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
                </div>
                <div>
                  <label>Expiry Date</label>
                  <input name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} required />
                </div>
                <div>
                  <label>Supplier</label>
                  <select name="supplier" value={formData.supplier} onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} required>
                    {SUPPLIER_OPTIONS.map(supplier => (
                      <option key={supplier} value={supplier}>{supplier}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button type="submit" style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 24px', borderRadius: '6px' }}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingItem(null)}
                  style={{ backgroundColor: '#e5e7eb', color: '#374151', padding: '8px 24px', borderRadius: '6px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Inventory Tables - One per category */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '16px' }}>Loading inventory...</div>
        ) : inventory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px' }}>No inventory items found.</div>
        ) : (
          <div>
            {/* Quick category links */}
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '24px'
            }}>
              {Object.keys(categorizedInventory).map(category => (
                <a 
                  key={category} 
                  href={`#${category}`}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '14px'
                  }}
                >
                  {category} ({categorizedInventory[category].length})
                </a>
              ))}
            </div>

            {/* One table per category */}
            {Object.keys(categorizedInventory).map(category => (
              <div key={category} id={category} style={{ marginBottom: '32px' }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#2563eb', 
                  marginBottom: '12px',
                  padding: '8px 0',
                  borderBottom: '2px solid #2563eb'
                }}>
                  {category} Category
                </h3>
                
                <table style={{ 
                  width: '100%', 
                  borderCollapse: 'collapse', 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <thead style={{ backgroundColor: '#e5e7eb' }}>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Medicine Name</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Price</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Quantity</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Expiry Date</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Supplier</th>
                      <th style={{ textAlign: 'left', padding: '12px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categorizedInventory[category].map(item => (
                      <tr key={item._id} style={{ 
                        borderBottom: '1px solid #e5e7eb',
                        backgroundColor: item.quantity < 25 ? '#fef2f2' : 'transparent'
                      }}>
                        <td style={{ padding: '12px' }}>{item.medicineName}</td>
                        <td style={{ padding: '12px' }}>LKR {item.price}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {item.quantity}
                            {item.quantity < 25 && (
                              <span style={{
                                marginLeft: '8px', 
                                display: 'inline-block',
                                width: '10px', 
                                height: '10px', 
                                backgroundColor: '#ef4444',
                                borderRadius: '50%'
                              }}></span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>{new Date(item.expiryDate).toLocaleDateString()}</td>
                        <td style={{ padding: '12px' }}>{item.supplier}</td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => handleEdit(item)}
                            style={{ 
                              marginRight: '8px', 
                              backgroundColor: '#3b82f6', 
                              color: 'white', 
                              padding: '4px 12px', 
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer'
                            }}>
                            Update
                          </button>
                          <button onClick={() => handleDelete(item._id)}
                            style={{ 
                              backgroundColor: '#ef4444', 
                              color: 'white', 
                              padding: '4px 12px', 
                              borderRadius: '4px',
                              border: 'none',
                              cursor: 'pointer'
                            }}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => navigate("/parmacyhome")}
            style={{
              backgroundColor: '#10b981', 
              color: 'white', 
              padding: '10px 24px',
              borderRadius: '8px', 
              cursor: 'pointer',
              border: 'none'
            }}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}