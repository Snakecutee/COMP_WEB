const Department = require("../model/department");
const IdeaModel = require("../model/idea");
const UserModel = require("../model/user")

const createDepartment = async (defaultDepartment) => {
    const { name } = defaultDepartment;
    if(name === ""){
        throw new Error("Name of Departments is required");
        return;
    }
    const checkDepartmentExistedInDb = await Department.findOne({ name });
    if (checkDepartmentExistedInDb) {
        throw new Error("Department already exists");
        return;
    } else {
        const createDepartment = new Department({ ...defaultDepartment });
        await createDepartment.save();
        return createDepartment;
    }
};

const getAllDepartments = async () =>{
    const departmentDB = await Department.find().sort([["createdAt", "asc"]]);
    return [...departmentDB];
}


module.exports = {
    createDepartment,
    getAllDepartments,
 
};

