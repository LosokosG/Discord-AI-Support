/**
 * Utility function to parse multipart/form-data requests
 * Returns an object with fields and files
 */
export async function parseMultipartFormData(request: Request) {
  const formData = await request.formData();
  const fields: Record<string, string> = {};
  let file: File | undefined;

  // Extract all form fields and files
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      file = value;
    } else {
      fields[key] = value.toString();
    }
  }

  return { fields, file };
}
