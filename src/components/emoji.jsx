import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";

function Form() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        address: "",
        city: "",
        rating: 0,
        feedback: "",
    });

    const [submittedData, setSubmittedData] = useState([]);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emojis = ["😡", "😕", "😐", "🙂", "😍"];

    // Load data from localStorage on mount
    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("submittedData"));
        if (storedData) {
            setSubmittedData(storedData);
        }
    }, []);

    // Store data in localStorage whenever submittedData changes
    useEffect(() => {
        localStorage.setItem("submittedData", JSON.stringify(submittedData));
    }, [submittedData]);

    const validateForm = () => {
        let formErrors = {};
        if (!formData.name) formErrors.name = "Name is required";
        if (!formData.email) {
            formErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            formErrors.email = "Please enter a valid email address";
        }
        if (!formData.password) formErrors.password = "Password is required";
        if (!formData.gender) formErrors.gender = "Gender is required";
        if (!formData.address) formErrors.address = "Address is required";
        if (!formData.city) formErrors.city = "City is required";
        if (!formData.rating) formErrors.rating = "Please select a rating";

        return formErrors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRatingChange = (rating) => {
        setFormData({ ...formData, rating });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            if (isEditing) {
                // Update the existing row
                const updatedData = submittedData.map((item, index) =>
                    index === editIndex ? formData : item
                );
                setSubmittedData(updatedData);
                setIsEditing(false);
                setEditIndex(null);
            } else {
                // Add new row
                setSubmittedData([...submittedData, formData]);
            }
            setFormData({
                name: "",
                email: "",
                password: "",
                gender: "",
                address: "",
                city: "",
                rating: 0,
                feedback: "",
            });
            setErrors({});
        } else {
            setErrors(validationErrors);
        }
    };

    const handleEdit = (index) => {
        setFormData(submittedData[index]);
        setIsEditing(true);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const updatedData = submittedData.filter((_, i) => i !== index);
        setSubmittedData(updatedData);
    };

    return (
        <div className="container mt-4">
            <div className="form-background p-4 rounded">
                <form onSubmit={handleSubmit} >
                    <div className="mb-3">
                        <label className="form-label">Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <p className="text-danger">{errors.name}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="text-danger">{errors.email}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <p className="text-danger">{errors.password}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Gender:</label>
                        <div>
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === "Male"}
                                onChange={handleChange}
                            />{" "}
                            Male
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === "Female"}
                                onChange={handleChange}
                            />{" "}
                            Female
                        </div>
                        {errors.gender && <p className="text-danger">{errors.gender}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Address:</label>
                        <textarea
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                        {errors.address && <p className="text-danger">{errors.address}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">City:</label>
                        <select
                            name="city"
                            className="form-select"
                            value={formData.city}
                            onChange={handleChange}
                        >
                            <option value="">Select City</option>
                            <option value="New York">New York</option>
                            <option value="Los Angeles">Los Angeles</option>
                            <option value="Chicago">Chicago</option>
                        </select>
                        {errors.city && <p className="text-danger">{errors.city}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Rating:</label>
                        <div className="rating d-flex">
                            {emojis.map((emoji, index) => (
                                <span
                                    key={index}
                                    onClick={() => handleRatingChange(index + 1)}
                                    style={{
                                        cursor: "pointer",
                                        fontSize: "2rem",
                                        transition: "color 0.3s",
                                        color: formData.rating > index ? "orange" : "gray",
                                    }}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                        {errors.rating && <p className="text-danger">{errors.rating}</p>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Feedback:</label>
                        <textarea
                            className="form-control"
                            name="feedback"
                            value={formData.feedback}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        {isEditing ? "Update" : "Submit"}
                    </button>
                </form>
            </div>

            <h2 className="mt-4">Submitted Data</h2>
            {submittedData.length > 0 && (
                <table className="table table-striped mt-2">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Rating</th>
                            <th>Feedback</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submittedData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.name}</td>
                                <td>{data.email}</td>
                                <td>{data.gender}</td>
                                <td>{data.address}</td>
                                <td>{data.city}</td>
                                <td>{emojis[data.rating - 1]}</td>
                                <td>{data.feedback}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(index)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Form;
