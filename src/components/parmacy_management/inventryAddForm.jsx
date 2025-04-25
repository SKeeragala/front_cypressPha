import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const InventoryForm = () => {
    const [medicineName, setMedicineName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [supplier, setSupplier] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Category options
    const categoryOptions = [
        { value: 'Antibiotics', label: 'Antibiotics' },
        { value: 'Painkillers', label: 'Painkillers' },
        { value: 'Vitamins', label: 'Vitamins' },
        { value: 'Cardiovascular', label: 'Cardiovascular' },
        { value: 'Respiratory', label: 'Respiratory' },
        { value: 'Gastrointestinal', label: 'Gastrointestinal' }
    ];

    // Supplier options
    const supplierOptions = [
        { value: 'Pharma Inc.', label: 'Pharma Inc.' },
        { value: 'MediSupply', label: 'MediSupply' },
        { value: 'HealthLife', label: 'HealthLife' },
        { value: 'Global Meds', label: 'Global Meds' },
        { value: 'Local Distributors', label: 'Local Distributors' }
    ];

    // Minimum date should be current date
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();

        // Add leading zero if month or day is less than 10
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;

        return `${year}-${month}-${day}`;
    };

    const validatePrice = (value) => {
        // Allow only numbers with up to 2 decimal places
        return /^\d+(\.\d{0,2})?$/.test(value) || value === '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Confirm before adding inventory if all details match
        try {
            // Check for existing inventory with same medicine, price, and expiry date
            const checkResponse = await axios.get('http://localhost:8070/inventory/checkin', {
                params: {
                    medicineName,
                    price: parseFloat(price),
                    expiryDate
                }
            });

            if (checkResponse.data.exists) {
                // Show confirmation dialog
                const result = await Swal.fire({
                    title: 'Duplicate Medicine Detected',
                    text: 'A similar medicine already exists. Do you want to add to the existing quantity?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, update quantity!'
                });

                if (!result.isConfirmed) {
                    return; // Stop if user cancels
                }
            }

            // Prepare medicine data
            const newMedicine = {
                medicineName,
                category,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                expiryDate,
                supplier
            };

            // Submit to backend
            const response = await axios.post(`http://localhost:8070/inventory/addin`, newMedicine);

            // Success handling
            toast.success(response.data.message);
            
            Swal.fire({
                icon: 'success',
                title: 'Inventory Updated',
                text: response.data.message,
                showConfirmButton: false,
                timer: 1500
            });

            // Reset form and navigate
            resetForm();
            navigate('/inventoryDetails');

        } catch (err) {
            // Error handling
            let errorMessage = "Failed to add to inventory. Please try again.";
            if (err.response && err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
            }

            toast.error(errorMessage);
            setError(errorMessage);

            Swal.fire({
                icon: 'error',
                title: 'Inventory Update Failed',
                text: errorMessage,
                showConfirmButton: true
            });
        }
    };

    const resetForm = () => {
        setMedicineName('');
        setCategory('');
        setPrice('');
        setQuantity('');
        setExpiryDate('');
        setSupplier('');
        setError(null);
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            backgroundImage: 'url(path-to-background-image)', // Replace with your background image URL
        }}>
            <div style={{
                position: "absolute",
                inset: "0",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)"
            }}></div>

            <div style={{
                position: "relative",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "0.5rem",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                padding: "1.5rem",
                width: "100%",
                maxWidth: "28rem",
                borderRadius: "12px"
            }}>
                <h1 style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    textAlign: "center",
                    color: "#4A4A4A",
                    marginBottom: "1.5rem"
                }}>
                    Pharmacy Inventory Management
                </h1>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Medicine Name */}
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: "500", 
                            color: "#333",
                            marginBottom: "0.25rem"
                        }}>
                            Medicine Name
                        </label>
                        <input
                            type="text"
                            value={medicineName}
                            onChange={(e) => setMedicineName(e.target.value)}
                            required
                            placeholder="Enter medicine name"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #D1D5DB",
                                borderRadius: "0.375rem",
                                outline: "none"
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)";
                                e.target.style.borderColor = "#3B82F6";
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = "none";
                                e.target.style.borderColor = "#D1D5DB";
                            }}
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: "500", 
                            color: "#333",
                            marginBottom: "0.25rem"
                        }}>
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #D1D5DB",
                                borderRadius: "0.375rem",
                                backgroundColor: "#F9FAFB",
                                outline: "none"
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)";
                                e.target.style.borderColor = "#3B82F6";
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = "none";
                                e.target.style.borderColor = "#D1D5DB";
                            }}
                        >
                            <option value="" disabled>Select category</option>
                            {categoryOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Price */}
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: "500", 
                            color: "#333",
                            marginBottom: "0.25rem"
                        }}>
                            Price (LKR)
                        </label>
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (validatePrice(value)) {
                                    setPrice(value);
                                }
                            }}
                            required
                            placeholder="0.00"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #D1D5DB",
                                borderRadius: "0.375rem",
                                outline: "none"
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)";
                                e.target.style.borderColor = "#3B82F6";
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = "none";
                                e.target.style.borderColor = "#D1D5DB";
                            }}
                        />
                    </div>

                    {/* Quantity */}
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: "500", 
                            color: "#333",
                            marginBottom: "0.25rem"
                        }}>
                            Quantity
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            min="1"
                            placeholder="Enter quantity"
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #D1D5DB",
                                borderRadius: "0.375rem",
                                outline: "none"
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)";
                                e.target.style.borderColor = "#3B82F6";
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = "none";
                                e.target.style.borderColor = "#D1D5DB";
                            }}
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: "500", 
                            color: "#333",
                            marginBottom: "0.25rem"
                        }}>
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            required
                            min={getCurrentDate()}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #D1D5DB",
                                borderRadius: "0.375rem",
                                outline: "none"
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)";
                                e.target.style.borderColor = "#3B82F6";
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = "none";
                                e.target.style.borderColor = "#D1D5DB";
                            }}
                        />
                    </div>

                    {/* Supplier */}
                    <div>
                        <label style={{ 
                            display: "block", 
                            fontSize: "14px", 
                            fontWeight: "500", 
                            color: "#333",
                            marginBottom: "0.25rem"
                        }}>
                            Supplier
                        </label>
                        <select
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #D1D5DB",
                                borderRadius: "0.375rem",
                                backgroundColor: "#F9FAFB",
                                outline: "none"
                            }}
                            onFocus={(e) => {
                                e.target.style.boxShadow = "0 0 0 2px rgba(59, 130, 246, 0.5)";
                                e.target.style.borderColor = "#3B82F6";
                            }}
                            onBlur={(e) => {
                                e.target.style.boxShadow = "none";
                                e.target.style.borderColor = "#D1D5DB";
                            }}
                        >
                            <option value="" disabled>Select supplier</option>
                            {supplierOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ 
                        display: "flex", 
                        gap: "1rem", 
                        paddingTop: "0.5rem", 
                        marginTop: "0.5rem" 
                    }}>
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                width: "50%",
                                backgroundColor: "#E5E7EB",
                                color: "#4B5563",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.375rem",
                                border: "none",
                                cursor: "pointer",
                                transition: "background-color 0.2s"
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = "#D1D5DB";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = "#E5E7EB";
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            style={{
                                width: "50%",
                                backgroundColor: "#2563EB",
                                color: "white",
                                padding: "0.5rem 1rem",
                                borderRadius: "0.375rem",
                                border: "none",
                                cursor: "pointer",
                                transition: "background-color 0.2s"
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = "#1D4ED8";
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = "#2563EB";
                            }}
                        >
                            Add to Inventory
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            color: "#EF4444",
                            fontSize: "14px",
                            marginTop: "0.5rem"
                        }}>
                            {error}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default InventoryForm;