import { zfd } from "zod-form-data";
import { z } from "zod";

export const loginSchema = zfd.formData({
  email: zfd.text(z.string().email()),
  password: zfd.text(
    z.string().min(8, "Password must be at least 8 characters long")
  ),
});
