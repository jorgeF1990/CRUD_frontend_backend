// src/components/ProductCard.jsx
const ProductCard = ({ product }) => {
  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <strong>Precio: ${product.price}</strong>
    </div>
  );
};

export default ProductCard;
