import { PrismaClient } from "@prisma/client";
import { Attribute } from "../../interfaces/attribute/type";

const prisma = new PrismaClient();

/**
 * Cari attribute by name (unique)
 */
export async function findAttributeByName(
  name: string
): Promise<Attribute | null> {
  return prisma.attribute.findUnique({ where: { name } });
}

/**
 * Buat attribute baru
 */
export async function createAttribute(name: string): Promise<Attribute> {
  return prisma.attribute.create({ data: { name } });
}

/**
 * Fetch all attributes
 */
export async function findAllAttributes(): Promise<Attribute[]> {
  return prisma.attribute.findMany();
}

/**
 * Fetch attributes whose name contains the given substring (case-insensitive)
 */
export async function findAttributesBySearch(
  search: string
): Promise<Attribute[]> {
  return prisma.attribute.findMany({
    where: { name: { contains: search, mode: "insensitive" } },
  });
}
