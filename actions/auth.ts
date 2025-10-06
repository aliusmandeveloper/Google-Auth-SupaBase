"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

export async function SignUp(formData: FormData) {
  const supabase = await createClient();

  const userData = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        username: userData.username,
      },
    },
  });

  if (error) {
    return { status: error.message, user: null };
  } else if (data?.user?.identities?.length === 0) {
    return { status: "User already exists, please login", user: null };
  }

  revalidatePath("/", "layout");
  return { status: "success", user: data.user };
}

export async function SignIn(formData: FormData) {
  const supabase = await createClient();

  const userData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password: userData.password,
  });
  if (error) {
    return { status: error.message, user: null };
  }
  //create a todo user instance in user-profiles table
  revalidatePath("/", "layout");
  return { status: "success", user: data.user };
}
