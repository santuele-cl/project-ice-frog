"use client";

import { useSession } from "next-auth/react";

const TestPage = () => {
  const session = useSession();

  return <div>{JSON.stringify(session)}</div>;
};

export default TestPage;
