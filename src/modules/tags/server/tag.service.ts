import { findAllTags } from "./tag.repository";

export async function listTags() {
  return findAllTags();
}
