"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { urlFor } from "../../lib/client";
import Product from "../../components/Product";
import { useStateContext } from "../../context/StateContext";

const ProductDetailsClient = ({ product, products }) => {
  const { image, name, details, price } = product;
  const [index, setIndex] = useState(0);
  const { decQty, incQty, qty, onAdd, setShowCart } = useStateContext();

  const containerRef = useRef(null);
  const lensRef = useRef(null);
  const resultRef = useRef(null);
  const imgRef = useRef(null);

  const handleBuyNow = () => {
    onAdd(product, qty);
    setShowCart(true);
  };

  useEffect(() => {
    const LENS_SIZE = 120;
    const ZOOM_FACTOR = 3;

    const container = containerRef.current;
    const lens = lensRef.current;
    const result = resultRef.current;
    const mainImg = imgRef.current;

    if (!container || !lens || !result || !mainImg) return;

    function updateZoom(e) {
      const rect = container.getBoundingClientRect();
      let lx = (e.clientX - rect.left) - LENS_SIZE / 2;
      let ly = (e.clientY - rect.top) - LENS_SIZE / 2;
      lx = Math.max(0, Math.min(lx, rect.width - LENS_SIZE));
      ly = Math.max(0, Math.min(ly, rect.height - LENS_SIZE));

      lens.style.left = lx + "px";
      lens.style.top = ly + "px";

      result.style.backgroundImage = `url(${mainImg.src})`;
      result.style.backgroundSize = `${rect.width * ZOOM_FACTOR}px ${rect.height * ZOOM_FACTOR}px`;
      result.style.backgroundPosition = `${-(lx * ZOOM_FACTOR)}px ${-(ly * ZOOM_FACTOR)}px`;
    }

    const showZoom = () => {
      lens.style.display = "block";
      result.style.display = "block";
    };
    const hideZoom = () => {
      lens.style.display = "none";
      result.style.display = "none";
    };

    container.addEventListener("mouseenter", showZoom);
    container.addEventListener("mouseleave", hideZoom);
    container.addEventListener("mousemove", updateZoom);

    return () => {
      container.removeEventListener("mouseenter", showZoom);
      container.removeEventListener("mouseleave", hideZoom);
      container.removeEventListener("mousemove", updateZoom);
    };
  }, [index]); // re-runs when image changes

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="zoom-wrapper">
            <div className="image-container" ref={containerRef}>
              <img
                ref={imgRef}
                src={urlFor(image && image[index])}
                className="product-detail-image"
              />
              <div className="zoom-lens" ref={lensRef}></div>
            </div>
            <div className="zoom-result" ref={resultRef}></div>
          </div>

          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">₹{price}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={incQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => onAdd(product, qty)}
            >
              Add to Cart
            </button>
            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsClient;