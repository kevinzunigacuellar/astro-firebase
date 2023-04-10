import { zfd } from "zod-form-data";
import { z } from "zod";

const userPasswordSchema = z.object({
  email: zfd.text(z.string().email()),
  password: zfd.text(
    z.string().min(8, "Password must be at least 8 characters long")
  ),
});

const birthdaySchema = z.object({
  name: zfd.text(z.string().min(2, "Name must be at least 2 character long")),
  affiliation: zfd.text(
    z
      .string()
      .min(1, "Affiliation must be at least 1 character long")
      .optional()
  ),
  month: zfd.numeric(
    z.number().min(1, "Month must be between 1 and 12").max(12)
  ),
  day: zfd.numeric(z.number().min(1).max(31)),
  year: zfd.numeric(
    z.number().min(1900, "Year must be between 1900 and 2021").optional()
  ),
});

const birthdaySchemaWithId = birthdaySchema.extend({
  authorId: zfd.text(z.string()),
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
export const createBirthdaySchema = zfd.formData(birthdaySchema);
export const updateBirthdaySchema = zfd.formData(birthdaySchemaWithId);
