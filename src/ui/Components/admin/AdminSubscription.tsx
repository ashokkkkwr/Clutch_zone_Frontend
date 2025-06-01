import { gql, useQuery } from '@apollo/client';
import axios from 'axios';
import { AlertCircle, CreditCard, Gamepad2, Gift, Loader2, Plus, Shield, Upload } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const FETCH_CLUTCH_BUCKS = gql`
  query GetClutchBucks {
    getClutchBucks {
      id
      amount
      price
      description
      bonus
      buckImage
    }
  }
`;

interface FormValues {
  amount: number;
  price: number;
  description: string;
  bonus: number;
  image: FileList | null;
}

export default function AdminSubscription() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { data, loading, error } = useQuery(FETCH_CLUTCH_BUCKS);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    watch
  } = useForm<FormValues>();

  const imageFile = watch('image');
  useEffect(() => {
    if (selectedPackage !== null && data) {
      const pkg = data.getClutchBucks[selectedPackage];
      reset({
        amount: pkg.amount,
        price: pkg.price,
        description: pkg.description,
        bonus: pkg.bonus,
        image: null,
      });
      setSuccessMessage('');
      setErrorMessage('');
    } else {
      reset({
        amount: 0,
        price: 0,
        description: '',
        bonus: 0,
        image: null,
      });
    }
  }, [selectedPackage, data, reset]);

  const onSubmit = async (formData: FormValues) => {
    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append('amount', formData.amount.toString());
    submitData.append('price', formData.price.toString());
    submitData.append('description', formData.description);
    submitData.append('bonus', formData.bonus.toString());
    if (formData.image && formData.image[0]) {
      submitData.append('image', formData.image[0]);
    }

    try {
      let response;
      const token = localStorage.getItem('token') ?? '';
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      if (selectedPackage === null) {
        // CREATE
        response = await axios.post(
          'http://localhost:5000/api/payment/create',
          submitData,
          config
        );
      } else {
        // UPDATE
        const pkgId = data.getClutchBucks[selectedPackage].id;
        response = await axios.patch(
          `http://localhost:5000/api/payment/update/${pkgId}`,
          submitData,
          config
        );
      }

      setSuccessMessage(response.data.message);
      setErrorMessage('');
      // reset form & selection
      reset();
      setSelectedPackage(null);
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : 'Operation failed';
      setErrorMessage(msg);
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <span className="ml-2 text-white">Loading Clutch Bucks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0a0a0a] text-red-400">
        <AlertCircle className="w-6 h-6 mr-2" />
        Error fetching data: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black p-6 w-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-red-500/10 blur-[100px] -z-10" />
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gamepad2 className="w-8 h-8 text-red-500" />
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              C-Bucks Store
            </h1>
          </div>
          <p className="text-red-400 text-lg">
            Manage C-Bucks Packages
          </p>
        </div>

        {/* Existing Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {data.getClutchBucks.map((pkg: any, index: number) => (
            <div
              key={index}
              className={`relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                selectedPackage === index
                  ? "ring-2 ring-red-500 transform scale-105 border-red-500/50"
                  : "hover:transform hover:scale-102 hover:border-red-500/30"
              }`}
              onClick={() => setSelectedPackage(index)}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-red-500/20">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />

              <div className="flex justify-center mb-4 relative">
                <div className="absolute inset-0 bg-red-500/20 blur-[50px] -z-10" />
                <img
                  src={pkg.buckImage || "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=400&fit=crop"}
                  alt="C-Bucks"
                  className="w-20 h-20 object-cover rounded-full ring-2 ring-red-500/20"
                />
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {pkg.amount.toLocaleString()}{" "}
                  <span className="text-red-400">C-Bucks</span>
                </h3>
                {pkg.bonus > 0 && (
                  <p className="text-red-400 text-sm mb-2 font-semibold">
                    +{pkg.bonus.toLocaleString()} Bonus
                  </p>
                )}
                <p className="text-zinc-400 text-sm mb-4">{pkg.description}</p>
                <p className="text-3xl font-bold text-white">
                  <span className="text-sm text-zinc-400">USD</span> ${pkg.price}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
            </div>
          ))}

          {/* Add New Package Button */}
          <div
            className="relative overflow-hidden bg-gradient-to-b from-zinc-900/50 to-black border-2 border-dashed border-zinc-800 rounded-xl p-6 cursor-pointer transition-all duration-300 flex items-center justify-center hover:border-red-500/30"
            onClick={() => setSelectedPackage(null)}
          >
            <div className="text-center">
              <Plus className="w-12 h-12 text-red-500/50 mx-auto mb-2" />
              <p className="text-zinc-400">Add New Package</p>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedPackage !== null ? 'Edit Package' : 'Create New Package'}
          </h2>

          {(successMessage || errorMessage) && (
            <div className={`mb-6 p-4 rounded-lg ${successMessage ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {successMessage || errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Amount
              </label>
              <input
                type="number"
                {...register('amount', { required: 'Amount is required', min: { value: 1, message: 'Amount must be positive' } })}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="Enter amount"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-400">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Price (NRS)
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: { value: 0.01, message: 'Price must be positive' } })}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-400">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Bonus Amount
              </label>
              <input
                type="number"
                {...register('bonus', { required: 'Bonus amount is required', min: { value: 0, message: 'Bonus cannot be negative' } })}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="Enter bonus amount"
              />
              {errors.bonus && (
                <p className="mt-1 text-sm text-red-400">{errors.bonus.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Description
              </label>
              <input
                type="text"
                {...register('description', { required: 'Description is required' })}
                className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="Enter description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-400">{errors.description.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Package Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-zinc-800 rounded-lg hover:border-red-500/30 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                  <div className="flex text-sm text-zinc-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-red-400 hover:text-red-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-red-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        {...register('image')}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-zinc-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {imageFile && imageFile[0] && (
                    <p className="text-sm text-zinc-400">
                      Selected: {imageFile[0].name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {selectedPackage !== null ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>

        {/* Features Section */}
        <div className="mt-12 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 group-hover:border-red-500/30 transition-colors">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-red-400 transition-colors">
                  Secure Management
                </h3>
                <p className="text-zinc-400 text-sm">Protected admin access</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 group-hover:border-red-500/30 transition-colors">
                <Gift className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-red-400 transition-colors">
                  Bonus System
                </h3>
                <p className="text-zinc-400 text-sm">
                  Reward loyal customers
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 group-hover:border-red-500/30 transition-colors">
                <CreditCard className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-red-400 transition-colors">
                  Flexible Pricing
                </h3>
                <p className="text-zinc-400 text-sm">
                  Customize package values
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}