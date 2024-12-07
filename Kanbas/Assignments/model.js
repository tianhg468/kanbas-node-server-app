import mongoose from "mongoose" ; 
import schema from "./schema.js" ; 

const Assignment = mongoose.model( "AssignmentModel" , schema); 
export default Assignment;