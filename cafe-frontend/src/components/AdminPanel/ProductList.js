import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./ProductList.css";

const ProductList = ({ products, onDelete, onEdit, onToggleHidden }) => {
    return (
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>Категория: {product.category}</p>
              <p>Цена: {parseFloat(product.price).toFixed(2)} BYN</p>
              <p>Описание: {product.description}</p>
              <p>
                Граммовка: {product.weight} {product.category === "Coffee" ? "мл." : "гр."}
              </p>
            </div>
            <div className="image-container">
              {product.imageUrl ? (
                <img
                  src={`http://localhost:5189${product.imageUrl}`} 
                  alt={product.name}
                  className="product-image"
                />
              ) : (
                <p>No image available</p>
              )}
              </div>
            <div className="product-actions">
              <button className="edit-button" onClick={() => onEdit(product)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button className="delete-button" onClick={() => onDelete(product.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button className="toggle-hidden-button" onClick={() => onToggleHidden(product)}>
                {product.isHidden ? (
                  <FontAwesomeIcon icon={faEye} title="Показать товар" />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} title="Скрыть товар" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
};

export default ProductList;
