import { redirect } from "next/dist/server/api-utils";
import { API_SOCIAL_URL } from "../../api/constants";
import * as storage from "../../api/storage/index";
import { Toaster, toast } from 'sonner'
const action = "/auth/login";
const method = "post";

export async function login(profile) {
  const loginURL = API_SOCIAL_URL + action;
  const body = JSON.stringify(profile);

  try {
    const response = await fetch(loginURL, {
      headers: {
        "Content-Type": "application/json",
      },
      method,
      body,
    });

    if (response.ok) {
      const { accessToken, ...user } = await response.json();
      storage.save("token", accessToken);
      storage.save("profile", user);

      // Display a success message using toast
      toast.success("User Signed in successfully");
      console.log(user);
    } else {
      // Handle the case where login fails, and display an error message using toast
      toast.error("User Sign-in failed");
      console.error(`Error signing in with status ${response.status}`);
    }
  } catch (error) {
    // Handle any unexpected errors and display an error message using toast
    toast.error(`Error signing in: ${error.message}`);
    console.error("Error signing in:", error);
  }
}
