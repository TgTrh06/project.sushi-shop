import { useState } from "react";

export const useApi = () => {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return { globalError, setGlobalError, loading, setLoading };
};