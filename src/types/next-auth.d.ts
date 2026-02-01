import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    fullName: string;
    role: string;
    policeStationName: string;
    badgeId: string;
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    fullName: string;
    role: string;
    policeStationName: string;
    badgeId: string;
  }
}