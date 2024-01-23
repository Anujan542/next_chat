import User from "@models/User";
import { connectToDB } from "@mongoDB";
import { hash } from "bcryptjs";

export const Post = async (req, res) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { username, email, password } = body;

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return new Response("User already exist", {
        status: 400,
      });
    }

    const hashPassword = await hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return new Response(JSON.stringify(newUser), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Failed to create a new user", {
      status: 500,
    });
  }
};
