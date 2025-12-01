// 🔐 middleware/roleCheck.js

const roleCheck = (requiredRoles) => {
    return (req, res, next) => {
      const userRole = req.user?.role; // ✅ Safe optional chaining
  
      // 🧪 Debug: Check user role and required role
      console.log("✅ Final Role Check:", userRole);
      console.log("🔒 Required Roles:", requiredRoles);
  
      // ❌ Role missing or not authorized
      if (!userRole || !requiredRoles.includes(userRole)) {
        return res.status(403).json({
          message: "Access denied: Insufficient permission",
        });
      }
  
      // ✅ Access granted
      next();
    };
  };
  
  module.exports = roleCheck;
  