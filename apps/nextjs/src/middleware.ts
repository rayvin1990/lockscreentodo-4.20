import { middleware } from "./utils/clerk";

export const config = {
  matcher: [
    // Don't run middleware on static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

export default middleware
