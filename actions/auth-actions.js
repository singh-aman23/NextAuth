"use server";

import { createAuthSession, destroySession } from "@/lib/auth";
import { hashUserPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { redirect } from "next/navigation";
import { verifyPassword } from "@/lib/hash";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = [];

  if (!email || email.trim().length === 0 || !email.includes("@")) {
    errors.push("Invalid email address");
  }

  if (!password || password.trim().length === 0 || password.length < 8) {
    errors.push("Password must be atleast 8 characters long");
  }

  if (errors.length === 0) {
    console.log(email, password);
  }

  if (errors.length > 0) {
    return { errors };
  }

  const hashedPassword = hashUserPassword(password);

  try {
    const id = createUser(email, hashedPassword);
    await createAuthSession(id);
    console.log("you have been redirected successfully");
  } catch (error) {
    console.log(error);
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      errors.push("Email is taken");
    } else {
      errors.push("An unexpected error occured");
    }
    return { errors };
  }
  redirect("/training");
}

export async function login(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = [];

  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    errors.push("Could not authenticate user, please check your credentials");
    return { errors };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    errors.push("Could not authenticate user, please check your credentials");
    return { errors };
  }
  await createAuthSession(existingUser.id);
  redirect("/training");
}

export async function auth(mode, prevState, formData){
  if(mode === 'login'){
    return login(prevState, formData);
  }
  return signup(prevState, formData);
}

export async function logout(){
 await destroySession();
 redirect('/');

}
