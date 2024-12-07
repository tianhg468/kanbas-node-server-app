import * as modulesDao from "./dao.js" ;

export default function ModuleRoutes(app) { 
    app.delete( "/api/modules/:moduleId" , async(req, res) => { 
        const { moduleId } = req.params; 
        const status = await modulesDao.deleteModule(moduleId); 
        res.send(status); 
    }); 
    
    // app.put( "/api/modules/:moduleId" , async (req, res) => { 
    //     const { moduleId } = req.params; 
    //     const moduleUpdates = req.body; 
    //     const status = await modulesDao.updateModule(moduleId, moduleUpdates); 
    //     res.send(status); 
    // });

    app.put("/api/modules/:moduleId", async (req, res) => {
        try {
            const { moduleId } = req.params;
            const moduleUpdates = req.body;
            
            if (!moduleId) {
                return res.status(400).json({ error: "Module ID is required" });
            }

            const updatedModule = await modulesDao.updateModule(moduleId, moduleUpdates);
            
            if (!updatedModule) {
                return res.status(404).json({ error: "Module not found" });
            }

            res.json(updatedModule);
        } catch (error) {
            console.error("Error updating module:", error);
            res.status(500).json({ 
                error: "Error updating module",
                details: error.message 
            });
        }
    });

}