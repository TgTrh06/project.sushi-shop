export const roleMiddleware = (requiredRole: string[]) => {
  return (req: any, res: any, next: any) => {
    const userRole = req.user.role;

    if (!userRole || !requiredRole.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};