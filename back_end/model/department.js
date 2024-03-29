const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
        name: {
            type: String,
            require: true,
            maxLength: 50
        },
        description: {
            type: String,
            maxLength: 200
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const DepartmentModel = mongoose.model("Department", departmentSchema);

module.exports = DepartmentModel;
