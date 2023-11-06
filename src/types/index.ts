import { Listing, Reservation, User } from "@prisma/client";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = Omit<RegisterRequest, "name">;

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};
