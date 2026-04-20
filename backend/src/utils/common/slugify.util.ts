import slugify from "slugify"

export const generateSlug = (text: string): string => {
  return slugify(text, {
    lower: true, // Convert to lowercase
    strict: true, // Remove special characters
    locale: "vi", // Use Vietnamese locale for better handling of Vietnamese characters
    trim: true, // Remove leading and trailing whitespace
  });
};