import React, { useState, useEffect } from "react";
import axios from "axios";
import { gql, useQuery } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";
import { Search, Plus, X, Upload, Package2, Edit, Trash } from "lucide-react";

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
  const [selectedGear, setSelectedGear] = useState<Gear | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const { data, loading, error, refetch } = useQuery(FETCH_GEARS);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  // Populate form data and preview when editing a gear.
  useEffect(() => {
    if (selectedGear) {
      reset({
        name: selectedGear.name,
        description: selectedGear.description,
        price: selectedGear.price,
        stock: selectedGear.stock,
        image: null, // reset the file input for new file selection
      });
      setPreviewImageUrl(selectedGear.image);
    } else {
      reset();
      setPreviewImageUrl(null);
    }
  }, [selectedGear, reset]);

  if (error) {
    console.error(error);
  }

  const onSubmit = async (formData: FormValues) => {
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("stock", formData.stock);

    // Check if a new file is selected
    if (formData.image && formData.image[0]) {
      submitData.append("image", formData.image[0]);
    } else if (selectedGear) {
      // Fetch the current image and convert it to a Blob,
      // then append it to FormData as if it were a freshly uploaded file.
      try {
        const response = await fetch(selectedGear.image);
        const blob = await response.blob();
        // Create a file name that can be used on the backend.
        const filename = `gear_${selectedGear.id}.jpg`;
        submitData.append("image", blob, filename);
      } catch (fetchError) {
        console.error("Failed to fetch the image blob:", fetchError);
        setErrorMessage("Failed to retrieve current image. Please try again.");
        return;
      }
    }

    try {
      let response;
      if (selectedGear) {
        response = await axios.patch<ApiResponse>(
          `http://localhost:5000/api/gear/update-gear/${selectedGear.id}`,
          submitData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post<ApiResponse>(
          "http://localhost:5000/api/gear/create",
          submitData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      reset();
      setIsPopupVisible(false);
      setSelectedGear(null);
      setPreviewImageUrl(null);
      await refetch();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || "Operation failed");
      } else {
        setErrorMessage("Operation failed");
      }
      setSuccessMessage("");
    }
  };

const deleteGear = async (id: string) => {
  if (window.confirm("Are you sure you want to delete this gear?")) {
    try {
      await axios.delete(`http://localhost:5000/api/gear/delete-gear/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await refetch();
      setSuccessMessage("Gear deleted successfully");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to delete gear");
      setSuccessMessage("");
    }
  }
};


  const filteredGears = data?.getGears.filter((gear: Gear) =>
    gear.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 w-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Package2 className="w-10 h-10" />
            Gear Management
          </h1>
          <div className="relative mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gears..."
              className="w-80 pl-10 pr-4 py-2 rounded-full bg-gray-800 border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Success & Error Messages */}
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

        {/* Gear Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Add New Gear Card */}
          <div
            className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-600 bg-gray-800/50 rounded-xl p-8 cursor-pointer hover:border-purple-500 hover:bg-gray-800 transition-all duration-300"
            onClick={() => {
              setSelectedGear(null);
              setIsPopupVisible(true);
            }}
          >
            <Plus className="w-12 h-12 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
            <span className="text-gray-300 group-hover:text-purple-500 transition-colors font-semibold">
              Add New Gear
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="col-span-full bg-red-500/10 border border-red-500 rounded-lg p-4 text-center text-red-500">
              Error fetching gears. Please try again later.
            </div>
          )}

          {/* Gear Cards */}
          {filteredGears?.map((gear: Gear) => (
            <div
              key={gear.id}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/20 transition-shadow"
            >
              <div className="relative h-56">
                <img
                  src={gear.image || "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80"}
                  alt={gear.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGear(gear);
                      setIsPopupVisible(true);
                    }}
                    className="p-2 bg-gray-800/50 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Edit className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGear(gear.id);
                    }}
                    className="p-2 bg-gray-800/50 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <Trash className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{gear.name}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {gear.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-purple-500 font-bold">${gear.price}</span>
                  <span className="text-sm text-gray-400">Stock: {gear.stock}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Adding/Editing Gear */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl w-full max-w-md p-6 border border-purple-500/20 relative">
            <button
              onClick={() => {
                setIsPopupVisible(false);
                setSelectedGear(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-6 h-6 text-purple-500" />
              {selectedGear ? "Edit Gear" : "Add New Gear"}
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Gear name"
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  placeholder="Description"
                  className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 min-h-[100px]"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("price", { required: "Price is required" })}
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.price.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    {...register("stock", { required: "Stock is required" })}
                    placeholder="Stock"
                    type="number"
                    className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.stock.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                          if (
                            e.target.files &&
                            e.target.files[0]
                          ) {
                            setPreviewImageUrl(
                              URL.createObjectURL(e.target.files[0])
                            );
                          }
                        }}
                        className="hidden"
                        id="gear-image-upload"
                        accept="image/*"
                      />
                      <label
                        htmlFor="gear-image-upload"
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                      >
                        <Upload className="w-5 h-5" />
                        {selectedGear ? "Change Image" : "Choose Image"}
                      </label>
                    </div>
                  )}
                />
                {previewImageUrl && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm text-gray-400">
                      Image Preview:
                    </p>
                    <img
                      src={previewImageUrl}
                      alt="Preview"
                      className="max-h-64 rounded-lg object-contain border border-gray-700"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {selectedGear ? "Update Gear" : "Add Gear"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
