"use client";

import { getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";

export default function CsrfToken() {
  const [csrf_token, setCsrf_token] = useState("");
  useEffect(() => {
    (async () => {
      setCsrf_token(await getCsrfToken());
    })();
  }, []);

  return <input type="hidden" name="csrfToken" value={csrf_token} />;
}
