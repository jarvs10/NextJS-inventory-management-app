"use server";

// import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";

import { z } from "zod";
import { prisma } from "../prisma";
import { revalidatePath } from "next/cache";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity must be non-negative"),
  sku: z.string().optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
});

export async function deleteProduct(formData: FormData) {
  const user = await getCurrentUser();
  const id = String(formData.get("id") || "");

  await prisma.product.deleteMany({
    where: { id: id, userId: user.id },
  });
}

export async function createProduct(formData: FormData) {
  const user = await getCurrentUser();

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") || undefined,
    lowStockAt: formData.get("lowStockAt") || undefined,
  });

  if (!parsed.success) {
    const errorMessages = parsed.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    throw new Error(`Validation failed: ${errorMessages}`);
  }

  try {
    await prisma.product.create({
      data: { ...parsed.data, userId: user.id },
    });

    revalidatePath("/inventory");
    
    // redirect("/inventory");
  } catch (error) {
    console.error("Error creating product:", error);
    
    // Handle specific Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } };
      
      // Unique constraint violation
      if (prismaError.code === 'P2002') {
        const field = prismaError.meta?.target?.[0] || 'field';
        throw new Error(`A product with this ${field} already exists. Please use a different ${field}.`);
      }
      
      // Foreign key constraint violation
      if (prismaError.code === 'P2003') {
        throw new Error('Invalid user reference. Please try logging in again.');
      }
      
      // Required field missing
      if (prismaError.code === 'P2012') {
        throw new Error('Required field is missing. Please fill in all required fields.');
      }
    }
    
    // Handle other types of errors
    if (error instanceof Error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
    
    // Fallback for unknown errors
    throw new Error("Failed to create product. Please try again.");
  }
}
