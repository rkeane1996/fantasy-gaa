export function generateUniqueCode(): string {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36 string
  const randomNum = Math.random().toString(36).substring(2, 9); // Generate a random base36 string
  return `${timestamp}-${randomNum}`;
}
