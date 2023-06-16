import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import User from "./components/user";

export default async function Home() {
  return <div>Hi</div>;
}
