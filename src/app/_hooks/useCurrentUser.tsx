import { useSession } from "next-auth/react";

const useGetUserInfo = () => {
  const session = useSession();

  return session.data?.user;
};

export default useGetUserInfo;
