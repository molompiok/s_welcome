import { useState } from "react";
import { getImg } from "../Utils/StringFormater";

const Card = ({ title, price, image }: any) => (
  <div
    className="card w-30 min-w-30 h-42 min-h-42 bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center text-center"
    style={{ 
      transformStyle: "preserve-3d",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
  >
    <img src={image} alt={title} className="w-24 h-24 mb-2" />
    <h3 className="text-lg font-bold">{title}</h3>
    <p className="text-green-600">${price}</p>
  </div>
);

const NavigationCard = () => (
  <div
    className="card mt-6  w-60 h-12 bg-gray-200 rounded-lg shadow-lg p-2 flex items-center justify-around"
    style={{ transformStyle: "preserve-3d" }}
  >
    <span>🏠</span>
    <span>🔔</span>
    <span>🛒</span>
    <span>👤</span>
  </div>
);

export const ProductPhone = () => {
  const [height, setHeight] = useState(0);
  const [rotateX, setRotateX] = useState(10);
  const [rotateY, setRotateY] = useState(-37);
  const [rotateZ, setRotateZ] = useState(0);
  const [scale, setScale] = useState(0.5);

  const cards = [
    { title: "Headphones", price: "150", image: "/res/view_product/casque.png" },
    { title: "Guitar", price: "299", image: "/res/view_product/chaise.png" },
    { title: "Cream", price: "109", image: "/res/view_product/chaussure.png" },
    { title: "Shoes", price: "150", image: "/res/view_product/habit.png" },
    { title: "Sunglasses", price: "229", image: "/res/view_product/parfun.png" },
    { title: "Watch", price: "199", image: "/res/view_product/foteuille.png" },
  ];

  return (
    <div className="relative p-4">
      {/* <div className="mb-4 space-y-2">
        <label>
          Height:{" "}
          <input
            type="range"
            min="0"
            max="100"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
          />{" "}
          <span>{height}</span>
        </label>
        <label>
          Rotate X:{" "}
          <input
            type="range"
            min="-45"
            max="45"
            value={rotateX}
            onChange={(e) => setRotateX(Number(e.target.value))}
          />{" "}
          <span>{rotateX}</span>
        </label>
        <label>
          Rotate Y:{" "}
          <input
            type="range"
            min="-45"
            max="45"
            value={rotateY}
            onChange={(e) => setRotateY(Number(e.target.value))}
          />{" "}
          <span>{rotateY}</span>
        </label>
        <label>
          Rotate Z:{" "}
          <input
            type="range"
            min="-45"
            max="45"
            value={rotateZ}
            onChange={(e) => setRotateZ(Number(e.target.value))}
          />{" "}
          <span>{rotateZ}</span>
        </label>
        <label>
          Scale:{" "}
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
          />{" "}
          <span>{scale}</span>
        </label>
      </div> */}
      <div
        className="relative "
        style={{
          width: `${443 * 0.45}px`,
          height: `${803 * 0.45}px`,
          background: getImg("/res/view_product/phone.png"),
          perspective: "1000px", // Unified perspective for 3D space
        }}
      >
        <div
          className="absolute ml-3 mt-6 top-[-150px] left-[-72px] "
          style={{
            transform: `translateZ(${height}px)  rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
            transformOrigin: "center",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="grid w-70  grid-cols-2 gap-4">
            {cards.map((card, index) => (
              <Card key={index} title={card.title} price={card.price} image={card.image} />
            ))}
          </div>
          <NavigationCard />
        </div>
      </div>
    </div>
  );
};