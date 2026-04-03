
import React from "react";
import { client } from "../../lib/client";
import ProductDetailsClient from "./ProductDetailsClient";

// Generate static params (replaces getStaticPaths)
export const generateStaticParams = async () => {
  const query = `*[_type == "product"] { slug { current } }`;
  const products = await client.fetch(query);

  return products.map((product) => ({
    slug: product.slug.current,
  }));
};

// Server Component (replaces getStaticProps)
const ProductDetails = async ({ params }) => {
  const { slug } = await params;

  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return <ProductDetailsClient product={product} products={products} />;
};

export default ProductDetails;
