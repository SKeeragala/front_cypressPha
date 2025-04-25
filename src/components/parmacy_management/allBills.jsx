import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Plus, Save, X } from 'lucide-react';
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AllBills = () => {
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBilling, setEditBilling] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    paymentMethod: "",
    medicines: [],
    totalAmount: 0,
  });
  const [previousTotal, setPreviousTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState(null);

  useEffect(() => {
    fetchBillings();
  }, []);

  const fetchBillings = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/billing/bi`);
      setBillings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching billing data:", error);
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch billing data',
      });
    }
  };

  const deleteBilling = async (id) => {
    try {
      await axios.delete(`http://localhost:8070/billing/deletebi/${id}`);
      setBillings(billings.filter((billing) => billing._id !== id));

      Swal.fire({
        icon: 'success',
        title: 'Bill Deleted',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error deleting billing:", error);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Unable to delete the bill',
      });
    }
  };

  const handleEdit = (billing) => {
    setEditBilling(billing._id);
    setPreviousTotal(billing.totalAmount);
    setFormData({
      customerName: billing.customerName,
      paymentMethod: billing.paymentMethod,
      medicines: billing.medicines,
      totalAmount: billing.totalAmount,
    });
    setIsModalOpen(true);
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = formData.medicines.map((med, i) =>
      i === index ? { ...med, [field]: value } : med
    );
    const totalAmount = updatedMedicines.reduce(
      (sum, med) => sum + med.quantity * med.price,
      0
    );
    setFormData({ ...formData, medicines: updatedMedicines, totalAmount });
  };

  const handleAddMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        { medName: "", price: 0, quantity: 0 },
      ],
    });
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = formData.medicines.filter((_, i) => i !== index);
    const totalAmount = updatedMedicines.reduce(
      (sum, med) => sum + med.quantity * med.price,
      0
    );
    setFormData({ 
      ...formData, 
      medicines: updatedMedicines, 
      totalAmount 
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8070/billing/upbi/${editBilling}`, formData);
      setBillings(billings.map((b) => (b._id === editBilling ? { ...b, ...formData } : b)));
      setIsModalOpen(false);
      setEditBilling(null);

      Swal.fire({
        icon: 'success',
        title: 'Bill Updated',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error updating billing:", error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Unable to update the bill',
      });
    }
  };

  const handlePrintReceipt = (billing) => {
    setReceiptToPrint(billing);
    
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const renderReceipt = () => {
    if (!receiptToPrint) return null;

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    return (
      <div style={{
        display: 'none', 
        padding: '1.5rem', 
        backgroundColor: 'white',
        visibility: 'visible',
        '@media print': {
          display: 'block'
        }
      }}>
        <div style={{
          border: '2px solid black',
          padding: '1.5rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>Pharmacy Receipt</h1>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            marginBottom: '1rem'
          }}>
            <div>
              <p><strong>Customer Name:</strong> {receiptToPrint.customerName}</p>
              <p><strong>Payment Method:</strong> {receiptToPrint.paymentMethod}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p><strong>Date:</strong> {formattedDate}</p>
              <p><strong>Time:</strong> {formattedTime}</p>
            </div>
          </div>

          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginBottom: '1rem'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f3f4f6' }}>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '0.5rem',
                  textAlign: 'left'
                }}>Medicine Name</th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '0.5rem',
                  textAlign: 'right'
                }}>Price (LKR)</th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '0.5rem',
                  textAlign: 'right'
                }}>Quantity</th>
                <th style={{
                  border: '1px solid #d1d5db',
                  padding: '0.5rem',
                  textAlign: 'right'
                }}>Subtotal (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {receiptToPrint.medicines.map((med, index) => (
                <tr key={index}>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '0.5rem'
                  }}>{med.medName}</td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '0.5rem',
                    textAlign: 'right'
                  }}>{med.price.toFixed(2)}</td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '0.5rem',
                    textAlign: 'right'
                  }}>{med.quantity}</td>
                  <td style={{
                    border: '1px solid #d1d5db',
                    padding: '0.5rem',
                    textAlign: 'right'
                  }}>{(med.price * med.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: 'right' }}>
            <p style={{
              fontSize: '1.25rem',
              fontWeight: 'bold'
            }}>Total Amount: LKR {receiptToPrint.totalAmount.toFixed(2)}</p>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.875rem'
          }}>
            <p>Thank you for your purchase!</p>
            <p>Pharmacy Management System</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ 
        background: 'linear-gradient(to bottom right, #fecaca, #e0f2fe)', 
        padding: '1.5rem' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '1.5rem', 
          backgroundColor: '#f9fafb', 
          minHeight: '100vh' 
        }}>
          <h2 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem', 
            textAlign: 'center', 
            color: '#1f2937' 
          }}>
            Billing Management
          </h2>

          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '16rem' 
            }}>
              <div style={{ 
                animation: 'spin 1s linear infinite',
                borderRadius: '9999px',
                height: '3rem',
                width: '3rem',
                borderTop: '2px solid #3b82f6',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }}></div>
            </div>
          ) : (
            <div style={{ 
              overflowX: 'auto', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', 
              borderRadius: '0.5rem' 
            }}>
              <table style={{ 
                width: '100%', 
                backgroundColor: 'white' 
              }}>
                <thead style={{ backgroundColor: '#2563eb', color: 'white' }}>
                  <tr>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Customer</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Total Amount (LKR)</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Payment Method</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billings.map((billing) => (
                    <tr key={billing._id} style={{ 
                      borderBottom: '1px solid #e5e7eb',
                      transition: 'background-color 0.2s ease',
                      ':hover': { backgroundColor: '#f3f4f6' }
                    }}>
                      <td style={{ padding: '0.75rem 1rem' }}>{billing.customerName}</td>
                      <td style={{ 
                        padding: '0.75rem 1rem', 
                        fontWeight: '600', 
                        color: '#10b981' 
                      }}>
                        LKR {billing.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{billing.paymentMethod}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {new Date(billing.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <button
                          onClick={() => handleEdit(billing)}
                          style={{ 
                            backgroundColor: '#3b82f6', 
                            color: 'white', 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '0.25rem',
                            marginRight: '0.5rem',
                            transition: 'background-color 0.3s ease'
                          }}
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteBilling(billing._id)}
                          style={{ 
                            backgroundColor: '#ef4444', 
                            color: 'white', 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '0.25rem',
                            marginRight: '0.5rem',
                            transition: 'background-color 0.3s ease'
                          }}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handlePrintReceipt(billing)}
                          style={{ 
                            backgroundColor: '#10b981', 
                            color: 'white', 
                            padding: '0.25rem 1.25rem', 
                            borderRadius: '0.25rem',
                            transition: 'background-color 0.3s ease'
                          }}
                        >
                          Print 
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit Modal */}
          {isModalOpen && (
            <div style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 50, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              backgroundColor: 'rgba(255, 255, 255, 0.3)', 
              backdropFilter: 'blur(4px)', 
              padding: '1rem' 
            }}>
              <div style={{ 
                backgroundColor: 'white', 
                borderRadius: '0.75rem', 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', 
                maxWidth: '42rem', 
                width: '100%', 
                maxHeight: '90vh', 
                overflowY: 'auto' 
              }}>
                <div style={{ 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  padding: '1.5rem', 
                  borderTopLeftRadius: '0.75rem', 
                  borderTopRightRadius: '0.75rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edit Billing Details</h3>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    style={{ 
                      padding: '0.5rem', 
                      borderRadius: '9999px', 
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    <X size={24} />
                  </button>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.5rem' 
                      }}>
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData({ ...formData, customerName: e.target.value })
                        }
                        style={{ 
                          width: '100%', 
                          padding: '0.5rem 1rem', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '0.5rem', 
                          outline: 'none'
                        }}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '0.875rem', 
                        fontWeight: '500', 
                        color: '#374151', 
                        marginBottom: '0.5rem' 
                      }}>
                        Payment Method
                      </label>
                      <input
                        type="text"
                        value={formData.paymentMethod}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMethod: e.target.value })
                        }
                        style={{ 
                          width: '100%', 
                          padding: '0.5rem 1rem', 
                          border: '1px solid #d1d5db', 
                          borderRadius: '0.5rem', 
                          outline: 'none'
                        }}
                        placeholder="Enter payment method"
                      />
                    </div>
                  </div>

                  {/* Medicines Table */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: '#374151', 
                      marginBottom: '0.5rem' 
                    }}>
                      Medicines
                    </label>
                    <div>
                      {formData.medicines.map((med, index) => (
                        <div
                          key={index}
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            borderBottom: '1px solid #e5e7eb', 
                            paddingTop: '0.5rem',
                            paddingBottom: '0.5rem',
                            marginBottom: '1rem'
                          }}
                        >
                          <input
                            type="text"
                            value={med.medName}
                            onChange={(e) =>
                              handleMedicineChange(index, 'medName', e.target.value)
                            }
                            style={{ 
                              width: '33%', 
                              padding: '0.5rem 1rem', 
                              border: '1px solid #d1d5db', 
                              borderRadius: '0.5rem', 
                              outline: 'none'
                            }}
                            placeholder="Medicine Name"
                          />
                          <input
                            type="number"
                            value={med.price}
                            onChange={(e) =>
                              handleMedicineChange(index, 'price', parseFloat(e.target.value) || 0)
                            }
                            style={{ 
                              width: '25%', 
                              padding: '0.5rem 1rem', 
                              border: '1px solid #d1d5db', 
                              borderRadius: '0.5rem', 
                              outline: 'none'
                            }}
                            placeholder="Price"
                          />
                          <input
                            type="number"
                            value={med.quantity}
                            onChange={(e) =>
                              handleMedicineChange(index, 'quantity', parseInt(e.target.value) || 0)
                            }
                            style={{ 
                              width: '25%', 
                              padding: '0.5rem 1rem', 
                              border: '1px solid #d1d5db', 
                              borderRadius: '0.5rem', 
                              outline: 'none'
                            }}
                            placeholder="Quantity"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(index)}
                            style={{ 
                              backgroundColor: '#ef4444', 
                              color: 'white', 
                              padding: '0.25rem 0.75rem', 
                              borderRadius: '0.25rem',
                              transition: 'background-color 0.3s ease'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddMedicine}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        marginTop: '1rem', 
                        color: '#3b82f6'
                      }}
                    >
                      <Plus size={16} /> Add Medicine
                    </button>
                  </div>

                  <div style={{ 
                    marginTop: '1rem', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                  }}>
                    <button
                      type="button"
                      onClick={handleUpdate}
                      style={{ 
                        backgroundColor: '#10b981', 
                        color: 'white', 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <Save size={16} style={{ marginRight: '0.5rem' }} /> Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{ 
                        backgroundColor: '#d1d5db', 
                        color: 'black', 
                        padding: '0.5rem 1.5rem', 
                        borderRadius: '0.5rem'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {renderReceipt()}
        </div>
      </div>
    </div>
  );
};

export default AllBills;