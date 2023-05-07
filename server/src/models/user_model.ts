import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value: String) => {
        //stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript
        const regEx = /^\S+@\S+\.\S+$/;
        return value.match(regEx);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: true,
    type: String,
    validate: {
      validator: (value: String) => {
        return value.length > 6;
        //TODO password must include a special character, a capitalized character, a number
      },
      message: "Password must be greater than 6 characters",
    },
  },
  address: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "user",
  },
  //TODO cart
});

export const User = mongoose.model("User", userSchema);
