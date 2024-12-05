import mongoose from "mongoose" ; 

const courseSchema = new mongoose.Schema( 
    { 
        _id: { 
            type: String,
            required: true,
            default: () => new mongoose.Types.ObjectId().toString() 
        },
        name: String, 
        number: String, 
        credits: Number, 
        description: String, 
    }, 
    { collection: "courses" } 
); 
export default courseSchema;