import { auth } from "@clerk/nextjs/server";

export const getRole = async () => {
  const { userId, sessionClaims } = await auth();
  return {
    role: (sessionClaims?.metadata as { role?: string })?.role,
    currentUserId: userId,
  };
};