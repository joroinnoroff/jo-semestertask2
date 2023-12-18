 
import { API_SOCIAL_URL } from "../../api/constants";
import { Toaster, toast } from 'sonner'

const action = "/auth/register";
const method = "post";

export async function register(profile) {
  const registerURL = API_SOCIAL_URL + action;
  const body = JSON.stringify(profile);

  try {
    const response = await fetch(registerURL, {
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
      toast.success("User Registered successfully");
      console.log(user);
    } else {
      // Handle the case where registration fails and display an error message using toast
      toast.error("User Registration failed");
      console.error(`Error registering with status ${response.status}`);
    }
  } catch (error) {
    // Handle any unexpected errors and display an error message using toast
    toast.error(`Error registering: ${error.message}`);
    console.error("Error registering:", error);
  }
}
