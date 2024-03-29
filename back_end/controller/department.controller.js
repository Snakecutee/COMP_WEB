const {
    createDepartment,
    getAllDepartments,
    findIdDepartment,
    deleteDepartment,
    updateDepartment,
    searchDepartment,
    reactiveDepartment,
} = require("../service/department.service");

const departmentController = {
    createDepartment: async (req, res) => {
        const defaultDepartment = req.body;
        console.log(defaultDepartment);
        try {
            const newDepartment = await createDepartment(defaultDepartment);
            res.status(201).json({
                message: "Department created successfully",
                status: 201,
                department: newDepartment,
            });
        } catch (error) {
            res.status(400).json({ message: error.message, status: 400 });
        }
    },

    getOneDepartmentById: async (req, res) =>{
        const { id } = req.params;
        try {
            res.status(200).json({data: await findIdDepartment(id)})
        } catch (error) {
            res.status(400).json({ message: error.message, status: 400 });
        }
    },

    getAllDepartments : async (req, res) =>{
        const name = req.query.name;
        if(name){
            const result = await searchDepartment(name);
            res.status(200).json(result);
        }
        else{
            const department = await getAllDepartments();
            res.status(200).json(department);
        }
    },

    deleteDepartment : async (req, res) =>{
        const { id } = req.params;
        try {
            await deleteDepartment(id);
            res.status(200).json({message: 'Delete Department Successfully.'})
        } catch (error) {
            res.status(400).json({ message: error.message, status: 400 });
        }
    },
    reactive: async (req, res) => {
        try {
            await reactiveDepartment(req.params.id);
            res.status(200).json({message: "Department reactived"})
        } catch (error) {
            res.status(200).json({ message: error.message });

        }
    }
    ,

    updateDepartment: async (req, res) =>{
        const { id } = req.params;
        const { description } = req.body;
        try {
            await updateDepartment(id, description);
            res.status(200).json({message: 'Update Department Successfully.'})
        } catch (error) {
            res.status(400).json({ message: error.message, status: 400 });
        }
    },

}

module.exports = departmentController;

