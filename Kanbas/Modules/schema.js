import mongoose from "mongoose" ; 
const schema = new mongoose.Schema( 
    {
        _id: { type: String, auto: true },
        name: { type: String, required: true },
        description: String,
        course: { type: String, ref: "CourseModel", required: true },
    },
    { collection: "modules", 
        toJSON: { 
            virtuals: true,
            transform: function(doc, ret) {
                if (!ret._id && ret.id) {
                    ret._id = ret.id;
                }
                return ret;
            }
        },
        toObject: { virtuals: true }
    }
);
export default schema;



