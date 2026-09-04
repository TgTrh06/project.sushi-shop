export function generateSlug(value: string): string {
  return value.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-");
}
