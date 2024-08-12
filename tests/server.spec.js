import request from "supertest";
import server from "../index";

describe("API Cafetería Nanacao - Tests de integración", () => {
  test("GET /cafes - Debe devolver un status code 200 y un arreglo de objetos", async () => {
    const response = await request(server).get("/cafes");
    expect(response.statusCode).toBe(200);
    expect(response.body instanceof Array).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /cafes/:id - Debe devolver un status code 200 y un objeto si el café existe", async () => {
    const response = await request(server).get("/cafes/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });

  test("GET /cafes/:id - Debe devolver un status code 404 si el café no existe", async () => {
    const response = await request(server).get("/cafes/999");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "No se encontró ningún cafe con ese id"
    );
  });

  test("POST /cafes - Debe agregar un nuevo café y devolver un código 201", async () => {
    const newCafe = { id: 6, nombre: "Café Mocha", precio: 2500 };
    const response = await request(server).post("/cafes").send(newCafe);
    expect(response.statusCode).toBe(201);
    expect(response.body).toContainEqual(newCafe);
  });

  test("POST /cafes - Debe devolver un código 400 si el café ya existe", async () => {
    const existingCafe = { id: 1, nombre: "Café Existente", precio: 3000 };
    const response = await request(server).post("/cafes").send(existingCafe);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Ya existe un cafe con ese id"
    );
  });

  test("PUT /cafes/:id - Debe devolver un status code 400 si el id en los parámetros difiere del id en el payload", async () => {
    const cafeToUpdate = { id: 2, nombre: "Café Latte", precio: 2700 };
    const response = await request(server).put("/cafes/3").send(cafeToUpdate);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "El id del parámetro no coincide con el id del café recibido"
    );
  });

  test("PUT /cafes/:id - Debe actualizar un café y devolver el café actualizado", async () => {
    const cafeToUpdate = { id: 2, nombre: "Café Actualizado", precio: 2800 };
    const response = await request(server).put("/cafes/2").send(cafeToUpdate);
    expect(response.statusCode).toBe(200);
    expect(response.body).toContainEqual(cafeToUpdate);
  });

  test("DELETE /cafes/:id - Debe devolver un código 404 si el café no existe", async () => {
    const response = await request(server)
      .delete("/cafes/fake_token")
      .set("Authorization", "Bearer token");
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "No se encontró ningún cafe con ese id"
    );
  });

  test("DELETE /cafes/:id - Debe devolver un código 400 si no se envía el token", async () => {
    const response = await request(server).delete("/cafes/1");
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "No recibió ningún token en las cabeceras"
    );
  });

  test("DELETE /cafes/:id - Debe eliminar un café y devolver el arreglo actualizado", async () => {
    const response = await request(server)
      .delete("/cafes/1")
      .set("Authorization", "Bearer token");
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toContainEqual(
      expect.objectContaining({ id: 1 })
    );
  });
});
