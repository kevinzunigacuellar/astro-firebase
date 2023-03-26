import { zfd } from "zod-form-data";
import { z } from "zod";

const userPasswordSchema = z.object({
  email: zfd.text(z.string().email()),
  password: zfd.text(
    z.string().min(8, "Password must be at least 8 characters long")
  ),
});

const register = userPasswordSchema
  .extend({
    name: zfd.text(z.string().min(2, "Name must be at least 2 character long")),
    confirmPassword: zfd.text(
      z.string().min(8, "Password must be at least 8 characters long")
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = zfd.formData(userPasswordSchema);
export const registerSchema = zfd.formData(register);
