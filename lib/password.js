import argon2 from "argon2";

export async function hashPassword(password) {
  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2id, // Version recommandée (mix d'Argon2i et Argon2d)
      timeCost: 3, // Coût en temps (augmente la sécurité)
      memoryCost: 4096, // Mémoire utilisée (en KiB)
      parallelism: 1, // Nombre de threads
    });
    return hash;
  } catch (err) {
    console.error("Erreur de hachage :", err);
  }
}

export async function verifyPassword(hash, password) {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    console.error("Erreur de vérification :", err);
    return false;
  }
}
