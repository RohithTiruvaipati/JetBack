export function isValidEmail(email: string) {
  const v = email.trim();
  return v.length >= 4 && v.length <= 20 && v.includes("@") && v.includes(".");
}

export function isValidPassword(password: string) {
  const v = password;
  const hasSpecialChar = /[^a-zA-Z0-9]/.test(v);
  return v.length >= 8 && hasSpecialChar;
}

