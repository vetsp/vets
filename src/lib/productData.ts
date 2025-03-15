import { supabase } from "./supabase";
import type { Database } from "../types/supabase";

// Product Categories
export type ProductCategory =
  Database["public"]["Tables"]["product_categories"]["Row"];
export type NewProductCategory =
  Database["public"]["Tables"]["product_categories"]["Insert"];

export async function getProductCategories() {
  const { data, error } = await supabase.from("product_categories").select("*");
  if (error) throw error;
  return data;
}

export async function addProductCategory(category: NewProductCategory) {
  const { data, error } = await supabase
    .from("product_categories")
    .insert(category)
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateProductCategory(
  id: string,
  updates: Partial<ProductCategory>,
) {
  const { data, error } = await supabase
    .from("product_categories")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteProductCategory(id: string) {
  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

// Product Names List
export async function getProductNames() {
  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .order("name");
  if (error) throw error;
  return data;
}

// Default product list for initial setup
export const defaultProductList = [
  "CG Basic",
  "CG MOM",
  "CG ESSENTIALS",
  "CG COLLABERRY",
  "CG TUMMY",
  "CG URIGOEL",
  "Chubby Balme Fungee",
  "GOAT UP 30 Pouch",
  "GOAT UP 90g JAR",
  "FP Milk Cleanser 60ml",
  "FP Milk Cleanser 100ml",
  "FP Powder - 25g",
  "Nyang-Nyang Spray",
  "BD BASIC",
  "BD ESSENTIAL",
  "BD COLLABERRY",
  "BD TUMMY",
  "BD URIGOEL",
  "HAIRBALL HERO 50G",
  "Hairball hero 100 G",
];
