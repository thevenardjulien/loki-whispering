export const verifToken = (req, res, next) => {
  const token = true;

  if (token) {
    next();
  } else {
    res.status(401).send("Vous n'êtes pas authentifié");
  }
};
