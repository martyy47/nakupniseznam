// server/auth.js (příklad, ty máš vlastní)
module.exports = function auth(req, res, next) {
  // TODO: tady si můžeš hrát s Authorities vs Operatives
  req.user = {
    id: "user-1",
    email: "test@example.com",
    profile: "Operatives", // nebo "Authorities"
  };
  next();
};