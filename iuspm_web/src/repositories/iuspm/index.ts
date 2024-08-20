import { type TypeRepository } from "../TypeRepository";
import ProdIUSPMRepository from "./prodRepository";
import IUSPMRepository from "./repository";

export function getIUSPMRepository(
  t: TypeRepository = "fake"
): IUSPMRepository {
  if (t === "fake") {
    return new IUSPMRepository();
  }
  return new ProdIUSPMRepository();
}