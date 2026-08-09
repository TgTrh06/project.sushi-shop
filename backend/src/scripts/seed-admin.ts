import mongoose from "mongoose";
import { env } from "@/core/config/env.config";
import { UserModel } from "@/modules/users/user.model";
import { hashPassword } from "@/utils/security/bcrypt.util";
import { Role } from "@itsu-sushi/shared/schemas/user.schema";

async function seedAdmin() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required to run the admin seed.",
    );
  }

  await mongoose.connect(env.MONGO_URI);

  const email = env.ADMIN_EMAIL.toLowerCase();
  const existingUser = await UserModel.findOne({ email }).select("+hashedPassword");

  if (existingUser) {
    if (existingUser.role !== Role.ADMIN) {
      throw new Error(
        `Refusing to promote existing non-admin account ${email}. Use a dedicated admin email.`,
      );
    }

    console.log(`Admin account already exists: ${email}`);
    return;
  }

  await UserModel.create({
    email,
    username: env.ADMIN_USERNAME,
    hashedPassword: await hashPassword(env.ADMIN_PASSWORD),
    role: Role.ADMIN,
  });

  console.log(`Admin account seeded: ${email}`);
}

seedAdmin()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Admin seed failed",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
