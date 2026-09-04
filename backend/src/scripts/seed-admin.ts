import { env } from "@/core/config/env.config";
import { connectDatabase } from "@/core/database/mongoose.connection";
import { UserModel } from "@/modules/users/infrastructure/mongoose/user.model";
import { BcryptPasswordHasher } from "@/modules/auth/infrastructure/bcrypt-password-hasher";
import { Role } from "@/modules/users/domain/entities/role";

async function seedAdmin() {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD are required to run the admin seed.",
    );
  }

  await connectDatabase();

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

  const hasher = new BcryptPasswordHasher();
  await UserModel.create({
    email,
    username: env.ADMIN_USERNAME,
    hashedPassword: await hasher.hash(env.ADMIN_PASSWORD),
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
  ;
