import { Product } from "@/lib/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <div className="border rounded-xl p-4 shadow-sm">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-cover rounded-lg"
      />
      <h3 className="font-semibold mt-2">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.brand}</p>
      <p className="text-sm">{product.packSize}</p>
      <p className="font-bold">₹{product.price}</p>
    </div>
  );
}