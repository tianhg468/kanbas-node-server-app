import model from "./model.js" ;

// export function findModulesForCourse(courseId) { 
//     return model.find({ course: courseId });
// }

export function findModulesForCourse(courseId) {
    console.log("DAO: Finding modules for course", courseId);
    return model.find({ course: courseId })
        .lean()  
        .then(modules => {
            console.log("DAO: Found modules:", modules);
            return modules;
        });
}

export function createModule(module) { 
    // delete module._id 
    return model.create(module);
}

export async function deleteModule(moduleId) { 
    return model.deleteOne({ _id: moduleId });
    
}

// export function updateModule(moduleId, moduleUpdates) { 
//     return model.updateOne({ _id: moduleId }, moduleUpdates);
// }

// export async function updateModule(moduleId, moduleUpdates) {
//     try {
//         if (!moduleId) {
//             throw new Error("Module ID is required");
//         }

//         const result = await model.findByIdAndUpdate(
//             moduleId,
//             { $set: moduleUpdates },
//             { new: true, runValidators: true }
//         );
//         return result;
//     } catch (error) {
//         console.error("Error updating module:", error);
//         throw error;
//     }
// }
export async function updateModule(moduleId, moduleUpdates) {
    try {
        console.log("Attempting to update module:", { moduleId, moduleUpdates });
        
        // Handle string ID
        const query = { _id: moduleId };
        
        const update = {
            $set: {
                name: moduleUpdates.name,
                description: moduleUpdates.description,
                course: moduleUpdates.course
            }
        };

        const options = { 
            new: true,
            runValidators: true 
        };

        const updated = await model.findOneAndUpdate(query, update, options);
        console.log("Update result:", updated);
        
        if (!updated) {
            throw new Error("Module not found");
        }
        
        return updated;
    } catch (error) {
        console.error("Error in updateModule:", error);
        throw error;
    }
}
