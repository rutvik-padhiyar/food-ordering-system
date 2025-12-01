const Address = require("../models/Address");

// ➤ SAVE NEW ADDRESS
const addAddress = async (req, res) => {
    try {
        const data = req.body;

        const userId = data.userId || req.user?._id;
        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }

        if (!data.fullAddress) {
            return res.status(400).json({ error: "Full address required" });
        }

        const newAddress = await Address.create({
            ...data,
            userId,
        });

        return res.json({ success: true, message: "Address saved", address: newAddress });
    } catch (err) {
        console.log("Add Address Error:", err);
        return res.status(500).json({ error: "Failed to save address" });
    }
};

// ➤ LIST ADDRESSES
const listAddress = async (req, res) => {
    try {
        const userId = req.params.userId || req.user?._id;

        if (!userId) return res.json([]);

        const list = await Address.find({ userId }).sort({ createdAt: -1 });

        return res.json({ success: true, addresses: list });
    } catch (err) {
        console.log("List Address Error:", err);
        return res.status(500).json({ error: "Failed to fetch address list" });
    }
};

// ➤ DELETE ADDRESS
const deleteAddress = async (req, res) => {
    try {
        const addressId = req.params.id;

        const deleted = await Address.findOneAndDelete({
            _id: addressId,
            userId: req.user._id,
        });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        return res.json({ success: true, message: "Address deleted successfully" });
    } catch (err) {
        console.log("Delete Address Error:", err);
        return res.status(500).json({ error: "Failed to delete address" });
    }
};

// ➤ UPDATE ADDRESS
const updateAddress = async (req, res) => {
    try {
        const addressId = req.params.id;

        const updated = await Address.findOneAndUpdate(
            { _id: addressId, userId: req.user._id },
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }

        return res.json({ success: true, message: "Address updated", address: updated });
    } catch (err) {
        console.log("Update Address Error:", err);
        return res.status(500).json({ error: "Failed to update address" });
    }
};

module.exports = { 
    addAddress, 
    listAddress, 
    deleteAddress, 
    updateAddress 
};
