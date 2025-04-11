export function checkPasswordStrength(password: string): string | null {
  if (password.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự";
  if (!/[a-z]/.test(password)) return "Mật khẩu phải chứa chữ thường";
  if (!/[A-Z]/.test(password)) return "Mật khẩu phải chứa chữ hoa";
  if (!/\d/.test(password)) return "Mật khẩu phải chứa số";
  if (!/[!@#$%^&*()_\-+=\[{\]};:'"\\|,.<>/?`~]/.test(password))
    return "Mật khẩu phải chứa ký tự đặc biệt";
  return null;
}

export function isEmailValidOrNot(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isPhoneValidOrNot(phone: string): boolean {
  return /^[0-9]{8,11}$/.test(phone);
}
