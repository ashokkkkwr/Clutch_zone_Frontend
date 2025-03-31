import React, { useState, useEffect } from "react";
import axios from "axios";
import { gql, useQuery } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
const FETCH_GAMES = gql`
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
interface ApiResponse {
  message: string;
}
interface FormValues {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: FileList | null;
}
export default function AddGears() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const { data, loading, error } = useQuery(FETCH_GAMES);
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  useEffect(() => {
    if (data) {
      console.log("Fetched Gears:", data.getGears);
    }
  }, [data]);
  const onSubmit = async (formData: FormValues) => {
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("stock", formData.stock);

    if (formData.image && formData.image[0]) {
      submitData.append("image", formData.image[0]);
    }
    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:5000/api/gear/create",
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      reset();
      setIsPopupVisible(false);
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Failed to create gear");
      } else {
        setErrorMessage("Failed to create gear");
      }
      setSuccessMessage("");
    }
  };

  const filteredGears = data?.getGears.filter((gear: Gear) =>
    gear.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6 w-screen">
      <div className="flex justify-end mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Gears..."
          className="w-80 px-4 py-2 rounded-full text-black"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Gears</h2>

      <div className="grid grid-cols-4 gap-6">
        <div
          className="flex flex-col items-center justify-center border border-gray-600 bg-gray-800 rounded-lg p-6 cursor-pointer"
          onClick={() => setIsPopupVisible(true)}
        >
          <span className="text-4xl text-orange-500 mb-2">+</span>
          <span className="text-gray-300">Add Gear</span>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div>Error fetching gears.</div>}
        {filteredGears?.map((gear: Gear) => (
          <div key={gear.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
            <img src={gear.image} alt={gear.name} className="w-full h-40 object-cover" />
            <div className="p-4 text-center font-medium">{gear.name}</div>
          </div>
        ))}
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Add New Gear</h3>
            {successMessage && <div className="bg-green-500 p-2 mb-4 rounded">{successMessage}</div>}
            {errorMessage && <div className="bg-red-500 p-2 mb-4 rounded">{errorMessage}</div>}
            <form onSubmit={handleSubmit(onSubmit)}>
              <input {...register("name", { required: "Name is required" })} placeholder="Name" />
              {errors.name && <p>{errors.name.message}</p>}
              <input {...register("description", { required: "Description is required" })} placeholder="Description" />
              {errors.description && <p>{errors.description.message}</p>}
              <input {...register("price", { required: "Price is required" })} placeholder="Price" />
              {errors.price && <p>{errors.price.message}</p>}
              <input {...register("stock", { required: "Stock is required" })} placeholder="Stock" />
              {errors.stock && <p>{errors.stock.message}</p>}
              <Controller name="image" control={control} render={({ field }) => <input type="file" onChange={(e) => field.onChange(e.target.files)} />} />
              <button type="submit">Add Gear</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
