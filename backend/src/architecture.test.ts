import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

function filesUnder(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(root, entry.name);
    return entry.isDirectory() ? filesUnder(absolute) : absolute.endsWith(".ts") ? [absolute] : [];
  });
}

describe("module dependency direction", () => {
  it("keeps domain and application free of infrastructure/framework imports", () => {
    const forbidden = /from ["'][^"']*(express|mongoose|cloudinary|jsonwebtoken|bcrypt|vnpay)[^"']*["']/;
    const moduleRoot = path.resolve(__dirname, "modules");
    const files = fs.readdirSync(moduleRoot).flatMap((name) => ["domain", "application"].flatMap((layer) => filesUnder(path.join(moduleRoot, name, layer))));
    const violations = files.filter((file) => forbidden.test(fs.readFileSync(file, "utf8")));
    expect(violations).toEqual([]);
  });
});
