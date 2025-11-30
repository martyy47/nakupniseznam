// server/auth.js

// Definice profilů (Profiles / Authorities)
const PROFILES = {
  ADMINISTRATORS: "Administrators", // plný přístup
  OPERATIVES: "Operatives",         // běžný uživatel
};

// Helper – načte „přihlášeného“ uživatele z HTTP hlaviček.
function currentUserMiddleware(req, res, next) {
  // pro jednoduchost očekáváme hlavičky:
  // x-user-id, x-user-role
  const userId = req.header("x-user-id");
  const userRole = req.header("x-user-role"); // "Administrators" | "Operatives"

  if (!userId || !userRole) {
    // nepřihlášený (anon)
    req.currentUser = null;
  } else {
    req.currentUser = {
      id: userId,
      profile: userRole,
    };
  }

  next();
}

// Ověření, že je uživatel přihlášený
function requireLogin(req, res, next) {
  if (!req.currentUser) {
    return res.status(401).json({
      uuAppErrorMap: { unauthorized: "User not logged in" },
    });
  }
  next();
}

// Ověření, že má user daný profil (např. Administrators)
function requireProfile(expectedProfile) {
  return (req, res, next) => {
    if (!req.currentUser) {
      return res.status(401).json({
        uuAppErrorMap: { unauthorized: "User not logged in" },
      });
    }

    if (req.currentUser.profile !== expectedProfile) {
      return res.status(403).json({
        uuAppErrorMap: { forbidden: "Insufficient permissions" },
      });
    }

    next();
  };
}

module.exports = {
  PROFILES,
  currentUserMiddleware,
  requireLogin,
  requireProfile,
};