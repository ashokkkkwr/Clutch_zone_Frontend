import React, { useRef, useState } from "react";
import axios from "axios";
import { Upload, Image as ImageIcon, Plus, ExternalLink, Loader2, AlertCircle, X, Download } from "lucide-react";

interface MediaItem {
  type: string;
  media_url: string;
  id: string;
  createdAt: string;
}

interface ErrorState {
  show: boolean;
  message: string;
}

const Media = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<ErrorState>({ show: false, message: "" });
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setError({ show: true, message });
    setTimeout(() => setError({ show: false, message: "" }), 5000);
  };

  const handleAddMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate file size and type
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    
    const invalidFiles = Array.from(files).filter(
      file => file.size > maxSize || !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      showError("Some files were rejected. Files must be under 5MB and in JPG, PNG, GIF, or MP4 format.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach((file) => {
      formData.append("image", file);
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication required");
      }
      
      await axios.post("http://localhost:5000/api/team/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          // You could add a progress bar here if needed
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 0));
          console.log(percentCompleted);
        },
      });
      
      await getMedia();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to upload media";
      showError(errorMessage);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getMedia = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Authentication required");
      }
      
      const response = await axios.get("http://localhost:5000/api/team/media", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      setMedia(response.data.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch media";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (mediaUrl: string) => {
    try {
      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = mediaUrl.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showError("Failed to download media");
    }
  };

  React.useEffect(() => {
    getMedia();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleAddMediaClick();
      } else if (event.key === "Escape" && selectedMedia) {
        setSelectedMedia(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMedia]);

  return (
    <div className="flex-1 p-6 bg-gray-900 min-h-screen">
      {/* Error Toast */}
      {error.show && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-slide-in">
          <AlertCircle className="w-5 h-5" />
          <span>{error.message}</span>
          <button 
            onClick={() => setError({ show: false, message: "" })}
            className="ml-2 hover:text-red-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Media Preview Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-gray-800 rounded-xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={() => handleDownload(selectedMedia.media_url)}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
              >
                <Download className="w-5 h-5 text-white" />
              </button>
              <button 
                onClick={() => setSelectedMedia(null)}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            {selectedMedia.type === "video" ? (
              <video
                src={selectedMedia.media_url}
                className="w-full max-h-[80vh] object-contain"
                controls
                autoPlay
              />
            ) : (
              <img
                src={selectedMedia.media_url}
                alt="Selected media"
                className="w-full max-h-[80vh] object-contain"
              />
            )}
            <div className="p-4 border-t border-gray-700">
              <p className="text-gray-300">
                Uploaded on {new Date(selectedMedia.createdAt).toLocaleDateString()} at{" "}
                {new Date(selectedMedia.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              RECENTLY ADDED MEDIA
            </h2>
            <p className="text-gray-400 mt-1">All media shared in the chat</p>
          </div>
          
          <div className="flex gap-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 transition-colors text-white font-medium ${
                isUploading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
              onClick={handleAddMediaClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              Add Media
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-colors">
              <ExternalLink className="w-5 h-5" />
              View All
            </button>
          </div>
          
          <input
            type="file"
            accept="image/*,video/mp4"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        ) : media.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((item, index) => (
              <div 
                key={item.id || index} 
                className="group relative bg-gray-800 rounded-xl overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
                onClick={() => setSelectedMedia(item)}
              >
                {item.type === "video" ? (
                  <video
                    src={item.media_url}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <img
                    src={item.media_url}
                    alt={`Media ${index + 1}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-800 rounded-xl">
            <Upload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg">No media found</p>
            <p className="text-gray-500 mt-2">Upload some images or videos to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Media;