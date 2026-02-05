import { Express } from "express";
import request from "supertest";
import { TESTING_PATH } from "../../core/paths/paths";
import { HttpStatus } from "../../core/types/types";

export async function clearDb(app: Express) {
  await request(app)
    .delete(`${TESTING_PATH}/all-data`)
    .expect(HttpStatus.NoContent);
  return;
}
