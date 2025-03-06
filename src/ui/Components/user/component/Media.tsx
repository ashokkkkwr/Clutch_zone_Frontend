import React from "react";

const Media = () => {
  return (
    <div className="flex-1 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">RECENTLY ADDED MEDIA</h2>
        <button className="text-orange-500 hover:text-orange-400">View All</button>
      </div>
      <p className="text-gray-400 mb-4">All media shared in the chat</p>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-[#1F2937] p-2 rounded-lg">
            <img
              src="https://via.placeholder.com/200"
              alt={`Media ${index + 1}`}
              className="rounded-lg w-full h-32 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Media;
