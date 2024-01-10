import supertest from "supertest";
import { app } from "../server";

describe("auth routes", () => {
    describe("POST:auth/login", () => {
        describe("given the user will provide invalid email then", () => {
            it("should validation errors with status 422", async () => {
                const response = {
                    success: false,
                    error: {
                        code: 422,
                        message:
                            "name Required, email Required, password Required",
                    },
                };
                await supertest(app).post("/auth/signin").send({
                    email:"test@gmail.com"
                }).expect(response);
            });
        });

        describe("given the user will not provide email then", () => {
            it("should return validation error 'email Required' with status 422", async () => {
                const response = {
                    success: false,
                    error: {
                        code: 422,
                        message: "name Required, password Required",
                    },
                };
                await supertest(app).post("/auth/signin").expect(response);
            });
        });
    });
});
