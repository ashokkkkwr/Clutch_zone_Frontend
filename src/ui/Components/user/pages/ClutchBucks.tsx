import React, { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {v4 as uuidv4} from 'uuid';
import CryptoJS from "crypto-js";
import { CreditCard, Sparkles, Gift, Shield, Gamepad2 } from "lucide-react";
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

function ClutchBucks() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const { data, loading, error } = useQuery(FETCH_CLUTCH_BUCKS);
  const [formData,setFormData]=useState({
    amount: "",
    tax_amount: "0",
    total_amount: "",
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: `http://localhost:5173/user/paymentsuccess`,
    failure_url: "http://localhost:5173/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });
  const generateSignature = (total_amount:any, transaction_uuid:any, product_code:any, secret:any) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    return CryptoJS.enc.Base64.stringify(hash);
  };
  useEffect(() => {
    if (selectedPackage !== null) {

      const selectedDetails = data.getClutchBucks[selectedPackage];
      const newFormData = {
        ...formData,
        success_url: `http://localhost:5173/user/paymentsuccess?clutchbuck_id=${selectedDetails.id}`,

        amount: selectedDetails.price.toString(),
        total_amount: selectedDetails.price.toString(),
        signature: generateSignature(
          selectedDetails.price.toString(),
          formData.transaction_uuid,
          formData.product_code,
          formData.secret
        ),
        clutchbuck_id:selectedDetails.id
      };
      setFormData(newFormData);
    }
  }, [selectedPackage]);
  useEffect(()=>{
    console.log(data)
  },[data])
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading Clutch Bucks...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-400">
        Error fetching data: {error.message}
      </div>
    );
  }
  const submit = (event:any) => {
    event.preventDefault();
    if (selectedPackage !== null) {
      const paymentForm = document.createElement("form");
      paymentForm.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      paymentForm.method = "POST";

      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        paymentForm.appendChild(input);
      });

      document.body.appendChild(paymentForm);
      paymentForm.submit();
    } else {
      console.log("No package selected");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black p-6">
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
            Level up your game with C-Bucks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  src="https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=400&fit=crop"
                  alt="V-Bucks"
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
                  <span className="text-sm text-zinc-400">USD</span> $
                  {pkg.price}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
            </div>
          ))}
        </div>

        <div className="mt-12 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 group">
              <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 group-hover:border-red-500/30 transition-colors">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-red-400 transition-colors">
                  Secure Payment
                </h3>
                <p className="text-zinc-400 text-sm">256-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 group-hover:border-red-500/30 transition-colors">
                <Gift className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-red-400 transition-colors">
                  Instant Delivery
                </h3>
                <p className="text-zinc-400 text-sm">
                  V-Bucks added immediately
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="p-3 bg-black/50 rounded-lg border border-zinc-800 group-hover:border-red-500/30 transition-colors">
                <CreditCard className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold group-hover:text-red-400 transition-colors">
                  Multiple Payment Methods
                </h3>
                <p className="text-zinc-400 text-sm">
                  Credit Card, PayPal & more
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
  className={`mt-8 w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 relative group ${
    selectedPackage !== null
      ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
      : "bg-zinc-800 text-zinc-400 cursor-not-allowed"
  }`}
  disabled={selectedPackage === null}
  onClick={submit} // Directly call submit function
>
  <div className="absolute inset-0 bg-red-500/20 blur-xl group-hover:bg-red-500/30 transition-colors" />
  <div className="relative flex items-center justify-center space-x-2">
    {selectedPackage !== null ? (
      <>
        <Sparkles className="w-5 h-5" />
        <span>Purchase V-Bucks</span>
      </>
    ) : (
      "Select a Package"
    )}
  </div>
</button>

      </div>
    </div>
  );
}

export default ClutchBucks;
