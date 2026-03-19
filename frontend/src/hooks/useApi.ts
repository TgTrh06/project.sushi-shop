import { useState } from "react";

export const useApi = () => {
  const [loading, setLoading] = useState(false);

  return { loading, setLoading };
};