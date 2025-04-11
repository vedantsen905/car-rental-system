import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name: 
    { type: String, 
        
        required: true },


    email: { type: String, 
        unique: true, 
        required: true },
    
    
    
        password: 
        { type: String,
             required: true },


        role:
    
    { type: String, enum: ["user", "admin"],
         default: "user" },


  }, { timestamps:true

  });
  
  
  userSchema.pre('save' , async function (next) {
    if(!this.isModified("password")) return next(
        

    )
    this.password = await bcrypt.hash(this.password, 10)
    next()

})

userSchema.methods.matchPassword = async function(password){
    
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.ACCESS_TOKEN_SECRET ,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY  } // adjust as needed
    );
  };
  
  // Generate Refresh Token
  userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  };

export  const User = mongoose.model("User", userSchema)