export function getAuthErrorMessage(error) {
  const code = error?.code || "";

  if (code.includes("invalid-credential")) {
    return "Incorrect email or password.";
  }

  if (code.includes("email-already-in-use")) {
    return "That email is already registered.";
  }

  if (code.includes("weak-password")) {
    return "Choose a password with at least 6 characters.";
  }

  if (code.includes("invalid-email")) {
    return "Enter a valid email address.";
  }

  return "Something went wrong. Please try again.";
}
