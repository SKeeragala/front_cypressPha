import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Save } from "lucide-react";

const BillingForm = () => {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    const [medicines, setMedicines] = useState([{ medName: '', quantity: '', price: '' }]);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState(null);
    const [inventoryItems, setInventoryItems] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);

    useEffect(() => {
        const currentDate = new Date().toISOString().split('T')[0];
        setDate(currentDate);

        // Fetch inventory to validate stock
        axios.get('http://localhost:8070/inventory/in')
            .then(response => {
                setInventoryItems(response.data);
            })
            .catch(error => {
                console.error("Error fetching inventory:", error);
                toast.error("Could not fetch inventory data");
            });
    }, []);

    const handleMedicineNameChange = (index, value) => {
        const newMedicines = [...medicines];
        newMedicines[index].medName = value;
        setMedicines(newMedicines);

        // Filter inventory items based on input
        if (value) {
            const filtered = inventoryItems.filter(item => 
                item.medicineName.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredMedicines(filtered);
        } else {
            setFilteredMedicines([]);
        }
    };

    // Select medicine from autocomplete
    const selectMedicine = (index, medicine) => {
        const newMedicines = [...medicines];
        newMedicines[index].medName = medicine.medicineName;
        newMedicines[index].price = medicine.price.toString();
        setMedicines(newMedicines);
        setFilteredMedicines([]); // Clear filtered list
    };

    // Validate stock before submission
    const validateStock = () => {
        for (let medicine of medicines) {
            const inventoryItem = inventoryItems.find(
                item => item.medicineName === medicine.medName
            );

            if (!inventoryItem) {
                setError(`Medicine ${medicine.medName} not found in inventory`);
                return false;
            }

            const requestedQuantity = parseInt(medicine.quantity);
            if (requestedQuantity > inventoryItem.quantity) {
                setError(`Insufficient stock for ${medicine.medName}. Available: ${inventoryItem.quantity}`);
                return false;
            }
        }
        return true;
    };

    const handleAddMedicine = () => {
        setMedicines([...medicines, { medName: '', quantity: '', price: '' }]);
    };

    const handleRemoveMedicine = (index) => {
        const newMedicines = [...medicines];
        newMedicines.splice(index, 1);
        setMedicines(newMedicines);
    };

    const handleMedicineChange = (index, field, value) => {
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const calculateTotal = () => {
        // If no medicines are added or medicines are empty, return 0.00
        if (medicines.length === 0 || medicines.every(med => !med.medName)) {
            return "0.00";
        }

        // Calculate total only for medicines with valid quantity and price
        return medicines.reduce((total, med) => {
            // Only calculate if both quantity and price are valid numbers
            const quantity = parseFloat(med.quantity) || 0;
            const price = parseFloat(med.price) || 0;
            return total + (quantity * price);
        }, 0).toFixed(2);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const stockValidation = validateStock();
        if (!stockValidation) return;

        const newBilling = {
            customerName,
            medicines,
            paymentMethod,
            date,
            total: calculateTotal()
        };

        axios.post(`http://localhost:8070/billing/addbi`, newBilling)
            .then(() => {
                toast.success('Billing added successfully');
                navigate('/billingDetails');
            })
            .catch((err) => {
                let errorMessage = "Failed to add billing. Please try again.";
                if (err.response && err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                }
                toast.error(errorMessage);
                setError(errorMessage);
            });
    };

    const resetForm = () => {
        setCustomerName('');
        setMedicines([{ medName: '', quantity: '', price: '' }]);
        setPaymentMethod('');
        const currentDate = new Date().toISOString().split('T')[0];
        setDate(currentDate);
        setError(null);
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
            position: "relative",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundImage: 'url("path-to-your-image.jpg")'
        }}>
            {/* Blurred overlay */}
            <div style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundColor: 'rgba(0, 0, 0, 0.3)', 
                backdropFilter: 'blur(10px)' 
            }}></div>

            <div style={{ 
                position: 'relative', 
                zIndex: 10, 
                width: '100%', 
                maxWidth: '640px' 
            }}>
                <div style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '20px', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    padding: '32px', 
                    border: '1px solid #BFDBFE' 
                }}>
                    <h1 style={{ 
                        fontSize: '24px', 
                        fontWeight: 'bold', 
                        textAlign: 'center', 
                        color: '#1E3A8A', 
                        marginBottom: '24px' 
                    }}>
                        Create New Billing Entry
                    </h1>

                    <form onSubmit={handleSubmit} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '24px' 
                    }}>
                        {/* Customer Name */}
                        <div>
                            <label style={{ 
                                display: 'block',
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: '#3B82F6', 
                                marginBottom: '8px' 
                            }}>
                                Customer Name
                            </label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #BFDBFE',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    fontSize: '14px',
                                    color: '#1F2937'
                                }}
                                placeholder="Enter customer name"
                            />
                        </div>

                        {/* Medicines Section */}
                        <div style={{ marginTop: '24px' }}>
                            <h2 style={{ 
                                fontSize: '20px', 
                                fontWeight: '600', 
                                color: '#3B82F6',
                                marginBottom: '16px'
                            }}>Medicines</h2>
                            {medicines.map((medicine, index) => (
                                <div key={index} style={{ 
                                    position: 'relative', 
                                    marginBottom: '16px' 
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: '16px', 
                                        alignItems: 'center' 
                                    }}>
                                        <div style={{ 
                                            width: '33%', 
                                            position: 'relative' 
                                        }}>
                                            <input
                                                type="text"
                                                value={medicine.medName}
                                                onChange={(e) => handleMedicineNameChange(index, e.target.value)}
                                                required
                                                placeholder="Medicine Name"
                                                style={{
                                                    width: '100%',
                                                    padding: '12px',
                                                    borderRadius: '8px',
                                                    fontSize: '14px',
                                                    border: '1px solid #D1D5DB',
                                                    color: '#374151'
                                                }}
                                            />
                                            {/* Autocomplete Dropdown */}
                                            {filteredMedicines.length > 0 && (
                                                <div style={{
                                                    position: 'absolute', 
                                                    zIndex: '10', 
                                                    width: '100%', 
                                                    backgroundColor: 'white', 
                                                    border: '1px solid #D1D5DB', 
                                                    borderRadius: '8px', 
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                                                    maxHeight: '160px', 
                                                    overflowY: 'auto'
                                                }}>
                                                    {filteredMedicines.map((item, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            onClick={() => selectMedicine(index, item)}
                                                            style={{
                                                                padding: '12px',
                                                                cursor: 'pointer'
                                                            }}
                                                            onMouseOver={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#E0F2FE';
                                                            }}
                                                            onMouseOut={(e) => {
                                                                e.currentTarget.style.backgroundColor = 'white';
                                                            }}
                                                        >
                                                            {item.medicineName} - ${item.price}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            type="number"
                                            value={medicine.quantity}
                                            onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                                            required
                                            min="1"
                                            placeholder="Quantity"
                                            style={{
                                                width: '33%',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                border: '1px solid #D1D5DB'
                                            }}
                                        />
                                        <input
                                            type="number"
                                            value={medicine.price}
                                            onChange={(e) => handleMedicineChange(index, 'price', e.target.value)}
                                            required
                                            min="0"
                                            step="0.01"
                                            placeholder="Price"
                                            style={{
                                                width: '33%',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                border: '1px solid #D1D5DB'
                                            }}
                                        />
                                        {index > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMedicine(index)}
                                                style={{
                                                    backgroundColor: 'transparent',
                                                    border: 'none',
                                                    color: '#EF4444',
                                                    cursor: 'pointer',
                                                    padding: '0'
                                                }}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddMedicine}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#10B981',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    border: 'none'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#059669';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#10B981';
                                }}
                            >
                                <PlusCircle style={{ marginRight: '8px' }} /> Add More Medicines
                            </button>
                        </div>

                        {/* Total Amount Display */}
                        <div style={{
                            backgroundColor: '#BFDBFE',
                            padding: '16px',
                            borderRadius: '8px',
                            marginTop: '16px'
                        }}>
                            <span style={{ fontWeight: '600', color: '#1E3A8A' }}>Total Amount: </span>
                            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#16A34A' }}>
                                LKR{calculateTotal()}
                            </span>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <label style={{ 
                                display: 'block',
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: '#3B82F6', 
                                marginBottom: '8px' 
                            }}>
                                Payment Method
                            </label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #BFDBFE',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    fontSize: '14px',
                                    color: '#1F2937'
                                }}
                            >
                                <option value="">Select Payment Method</option>
                                <option value="Cash">Cash</option>
                                <option value="Debit">Debit Card</option>
                                <option value="Credit">Credit Card</option>
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label style={{ 
                                display: 'block',
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: '#3B82F6', 
                                marginBottom: '8px' 
                            }}>
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '2px solid #BFDBFE',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    transition: 'all 0.3s ease',
                                    fontSize: '14px',
                                    color: '#1F2937'
                                }}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div style={{ 
                            display: 'flex', 
                            gap: '16px', 
                            paddingTop: '16px' 
                        }}>
                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    width: '50%',
                                    backgroundColor: '#E5E7EB',
                                    color: '#1F2937',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: 'none'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#D1D5DB';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                                }}
                            >
                                <Trash2 style={{ marginRight: '8px' }} /> Reset
                            </button>
                            <button
                                type="submit"
                                style={{
                                    width: '50%',
                                    backgroundColor: '#2563EB',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: 'none'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1D4ED8';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#2563EB';
                                }}
                            >
                                <Save style={{ marginRight: '8px' }} /> Save Billing
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div style={{
                                color: '#EF4444',
                                fontSize: '14px',
                                marginTop: '8px',
                                textAlign: 'center',
                                backgroundColor: '#FEE2E2',
                                padding: '8px',
                                borderRadius: '8px'
                            }}>
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BillingForm;