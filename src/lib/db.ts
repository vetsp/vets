import { supabase } from "./supabase";
import type { Database } from "../types/supabase";

// Products
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type NewProduct = Database["public"]["Tables"]["products"]["Insert"];

export async function getProducts() {
  const { data, error } = await supabase.from("products").select("*");
  if (error) throw error;
  return data;
}

export async function addProduct(product: NewProduct) {
  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
  return true;
}

// Product Movements
export type ProductMovement =
  Database["public"]["Tables"]["product_movements"]["Row"];
export type NewProductMovement =
  Database["public"]["Tables"]["product_movements"]["Insert"];

export async function getProductMovements() {
  const { data, error } = await supabase.from("product_movements").select("*");
  if (error) throw error;
  return data;
}

export async function addProductMovement(movement: NewProductMovement) {
  const { data, error } = await supabase
    .from("product_movements")
    .insert(movement)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteProductMovement(id: string) {
  const { error } = await supabase
    .from("product_movements")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}

// Sales Transactions
export type Transaction =
  Database["public"]["Tables"]["sales_transactions"]["Row"];
export type NewTransaction =
  Database["public"]["Tables"]["sales_transactions"]["Insert"];

export async function getTransactions() {
  const { data, error } = await supabase.from("sales_transactions").select("*");
  if (error) throw error;
  return data;
}

export async function addTransaction(transaction: NewTransaction) {
  const { data, error } = await supabase
    .from("sales_transactions")
    .insert(transaction)
    .select();
  if (error) throw error;
  return data[0];
}

// Operational Supplies
export type Supply =
  Database["public"]["Tables"]["operational_supplies"]["Row"];
export type NewSupply =
  Database["public"]["Tables"]["operational_supplies"]["Insert"];

export async function getSupplies() {
  const { data, error } = await supabase
    .from("operational_supplies")
    .select("*");
  if (error) throw error;
  return data;
}

export async function addSupply(supply: NewSupply) {
  const { data, error } = await supabase
    .from("operational_supplies")
    .insert(supply)
    .select();
  if (error) throw error;
  return data[0];
}

export async function updateSupply(id: string, updates: Partial<Supply>) {
  const { data, error } = await supabase
    .from("operational_supplies")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

export async function deleteSupply(id: string) {
  const { error } = await supabase
    .from("operational_supplies")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}
