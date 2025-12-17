import mongoose from "mongoose";

const stateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        trim: true
    }
});

const countrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    states: [stateSchema],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Country = mongoose.model("Country", countrySchema);

export default Country;
