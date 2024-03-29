const Department = require('../model/department');


const getSubRouter = async () => {
    const departmentRouters = await Department.find({deleted: false});
    return {departmentRouters: departmentRouters.map(item => ({
            name: item.name
        }))}
}

module.exports = {getSubRouter}
