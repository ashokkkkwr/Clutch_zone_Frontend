import React, { useState } from "react";
import axios from "axios";
import { gql, useQuery } from "@apollo/client";
import { Package2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FETCH_GEARS = gql`
  query GetGears {
    getGears {
      id
      name
      description
      price
      image
      stock
    }
  }
`;

interface Gear {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  stock: string;
}

export default function HomeGears() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useQuery(FETCH_GEARS);

  const handleQuantityChange = (gearId: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [gearId]: value,
    }));
  };

  const handleAddToCart = async (e: React.FormEvent, gearId: string) => {
    e.preventDefault();
    const quantity = quantities[gearId] || 1;

    try {
      await axios.post("http://localhost:5000/api/gear/add-to-cart", {
        gearId,
        quantity,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Item added to cart successfully");
            refetch();

      // setErrorMessage("");
    } catch (err) {
            toast.error("Failed to add item to cart");

    }
  };

  const deleteGear = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this gear?")) {
      try {
        await axios.delete(`http://localhost:5000/api/gear/${id}`);
        await refetch();
        setSuccessMessage("Gear deleted successfully");
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Failed to delete gear");
        setSuccessMessage("");
      }
    }
  };

  const gears: Gear[] = data?.getGears || [];

  return (
    <div className="h-full bg-[#001219] text-white mb-12">
      <div className="mx-auto px-8 lg:px-28">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-[24px] font-bold italic tracking-wide font-[Poppins] flex items-center gap-2">
            🔥 Featured Gears
          </h1>
          <button
            onClick={() => navigate("/user/tournament")}
            className="text-white bg-gradient-to-r from-pink-500 to-red-500 px-6 py-2 rounded-full shadow-lg hover:from-pink-600 hover:to-red-600 transform hover:scale-105 transition duration-300"
          >
            View All
          </button>
        </div>

        {/* Notifications */}
        {(successMessage || errorMessage) && (
          <div className="mb-4">
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded-lg">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg">
                {errorMessage}
              </div>
            )}
          </div>
        )}

        {/* Loading and Error States */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-center text-red-500 mb-8">
            Error fetching gears. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gears.map((gear) => {
              const qty = quantities[gear.id] || 1;
              return (
                <div
                  key={gear.id}
                  className="group bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden hover:border-pink-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        gear.image ||
                        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80"
                      }
                      alt={gear.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-orange-500 group-hover:text-orange-400 transition-colors">
                        {gear.name}
                      </h2>
                      <span className="text-sm text-gray-400">Stock: {gear.stock}</span>
                    </div>
                    <p className="text-gray-400 line-clamp-2">{gear.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-orange-500 font-bold">${gear.price}</span>
                    </div>

                    {/* Slider for Quantity */}
                    <div>
                      <label htmlFor={`slider-${gear.id}`} className="block text-sm text-gray-300">
                        Quantity: <span className="font-medium text-white">{qty}</span>
                      </label>
                      <input
                        id={`slider-${gear.id}`}                        
                        type="range"
                        min={1}
                        max={Number(gear.stock) || 1}
                        value={qty}
                        onChange={(e) => handleQuantityChange(gear.id, Number(e.target.value))}
                        className="w-full mt-2 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer
                          thumb:appearance-none thumb:h-4 thumb:w-4 thumb:rounded-full thumb:bg-pink-500 thumb:border-2 thumb:border-gray-700 hover:thumb:bg-pink-600"
                      />
                    </div>

                    {/* Add to Cart Button */}
                    <form onSubmit={(e) => handleAddToCart(e, gear.id)}>
                      <button
                        type="submit"
                        className="w-full flex justify-center items-center py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full shadow-lg transform hover:scale-105 transition duration-300"
                      >
                        <Package2 className="mr-2 h-5 w-5" />
                        <span className="font-semibold text-white">Add {qty} to Cart</span>
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
