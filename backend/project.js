const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/crm', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Create Customer Schema and Model
const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    notes: { type: String }
}, { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);

// Routes

// GET /customers: Get all customers
app.get('/customers', async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customers', error: err.message });
    }
});

// GET /customers/:id: Get a single customer by ID
app.get('/customers/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching customer', error: err.message });
    }
});

// POST /customers: Create a new customer
app.post('/customers', async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).json(savedCustomer);
    } catch (err) {
        res.status(400).json({ message: 'Error creating customer', error: err.message });
    }
});

// PUT /customers/:id: Update a customer by ID
app.put('/customers/:id', async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: 'Error updating customer', error: err.message });
    }
});

// DELETE /customers/:id: Delete a customer by ID
app.delete('/customers/:id', async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting customer', error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running..`);
});