"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
// import { redirect } from "next/dist/server/api-utils";
import { redirect } from "next/navigation";
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

  const { data: existingUser } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("email", userData?.email)
    .limit(1)
    .single();
  if (!existingUser) {
    const { error: inserError } = await supabase.from("user_profiles").insert({
      email: data?.user.email,
      username: data?.user?.user_metadata?.username,
    });
    if (inserError) {
      return {
        status: inserError?.message,
        user: null,
      };
    }
  }

  revalidatePath("/", "layout");
  return { status: "success", user: data.user };
}
export async function SignOut() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
