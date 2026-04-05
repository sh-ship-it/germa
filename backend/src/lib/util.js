import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {

  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks: cross-site scripting
    sameSite: ENV.NODE_ENV === "production" ? "none" : "strict", // 'none' required for cross-domain
    secure: ENV.NODE_ENV !== "development", // required when sameSite is 'none'
  });


  return token;
};

// http://localhost
// https://dsmakmk.com