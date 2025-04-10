import request from "supertest";
import { app } from "../index.js";
import { it, describe, expect } from "@jest/globals";

describe("Test de /api/v1/whisper", () => {
  it("Doit retourner un statut 200", async () => {
    await request(app).get("/api/v1/whisper").expect(200);
  });

  it("Ne doit pas retourner une liste vide", async () => {
    expect(await request(app).get("/api/v1/whisper")).toBeDefined();
  });
});

describe("Test de /api/v1/whisper/:id", () => {
  it("Doit retourner un statut 200", async () => {
    await request(app).get("/api/v1/whisper/m02xapt15un").expect(200);
  });
});
