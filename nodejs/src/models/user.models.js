import mongoose, {Schema}  from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new Schema({
      name: {
                type: String,
                required: true,
        },
        email:{
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true,    
        },
        password:{
                type: String,
                required: true,
        },
        role:{
                type: String,
                enum: ["ADMIN", "AUTHOR", "USER"],
                default: "USER",
        },
        avatar:{
                type: String,
        }
}, {timestamp: true})

// password hash
userSchema.pre("save", async function () {
        if (!this.isModified("password")) return;
        this.password = await bcrypt.hash(this.password, 10);
      });
// compare password
userSchema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)
export default User