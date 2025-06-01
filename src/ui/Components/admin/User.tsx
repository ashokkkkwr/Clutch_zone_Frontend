import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Pencil, 
  Trash2, 
  UserX, 
  Loader2, 
  Users, 
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import { X, Plus, Upload } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

// Define the User interface
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatar: string;
}
interface FormValues {
  username: string;
  email: string;
  role: string;
  avatar: FileList | null;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUsers, setDeletingUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string>("");
const [errorMessage, setErrorMessage] = useState<string>("");
const {
  handleSubmit,
  register,
  control,
  reset,
  formState: { errors },
} = useForm<FormValues>();





// Add useEffect for form population
useEffect(() => {
  if (selectedUser) {
    reset({
      username: selectedUser.username,
      email: selectedUser.email,
      role: selectedUser.role,
      avatar: null,
    });
    setPreviewAvatarUrl(selectedUser.avatar);
  } else {
    reset();
    setPreviewAvatarUrl(null);
  }
}, [selectedUser, reset]);

// Add form submit handler
const onSubmitUser = async (formData: FormValues) => {
  const submitData = new FormData();
  submitData.append("username", formData.username);
  submitData.append("email", formData.email);
  submitData.append("role", formData.role);

  if (formData.avatar && formData.avatar[0]) {
    submitData.append("image", formData.avatar[0]);
  } else if (selectedUser) {
    try {
      const response = await fetch(selectedUser.avatar);
      const blob = await response.blob();
      const filename = `user_${selectedUser.id}_avatar.jpg`;
      submitData.append("image", blob, filename);
    } catch (fetchError) {
      console.error("Failed to fetch avatar:", fetchError);
      setErrorMessage("Failed to retrieve current avatar");
      return;
    }
  }

  try {
    let response;
    if (selectedUser) {
      response = await axios.patch(
        `http://localhost:5000/api/user/update-profile/${selectedUser.id}`,
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      response = await axios.post(
        "http://localhost:5000/api/user/register",
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    }

   toast.success(response.data.message);
    reset();
    setIsPopupVisible(false);
    setSelectedUser(null);
    setPreviewAvatarUrl(null);
    await fetchAllUsers();
  } catch (error) {
    console.log("🚀 ~ onSubmitUser ~ error:", error)
    if (axios.isAxiosError(error) && error.response) {
      setErrorMessage(error.response.data.message || "Operation failed");
    } else {
      setErrorMessage("Operation failed");
    }
    setSuccessMessage("");
  }
};

// Update handleUpdate function
const handleUpdate = (id: string) => {
  const user = users.find(u => u.id === id);
  if (user) {
    setSelectedUser(user);
    setIsPopupVisible(true);
  }
};

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, selectedRole, users]);

  const filterUsers = () => {
    let result = [...users];
    
    if (searchTerm) {
      result = result.filter(user => 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedRole !== "all") {
      result = result.filter(user => user.role === selectedRole);
    }
    
    setFilteredUsers(result);
  };

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/user/get-all-users");
      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
    } catch (err: unknown) {
      setError("Failed to fetch users. Please try again later.");
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };



  const handleDelete = async (id: string) => {
    try {
      setDeletingUsers((prev) => new Set(prev).add(id));
      await axios.delete(`http://localhost:5000/api/user/delete-user/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (err: unknown) {
      console.log("🚀 ~ handleDelete ~ err:", err)
      console.error("Error deleting user:", err);
     toast.error("Failed to delete user. Please try again.");
    } finally {
      setDeletingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800",
      user: "bg-blue-100 text-blue-800",
      moderator: "bg-green-100 text-green-800",
      default: "bg-gray-100 text-gray-800"
    };
    return colors[role as keyof typeof colors] || colors.default;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <p className="text-gray-300 font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-900">
        <UserX className="w-16 h-16 text-red-500" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Users</h2>
          <p className="text-red-400 mb-6">{error}</p>
        </div>
        <button
          onClick={fetchAllUsers}
          className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 w-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">User Management</h1>
            </div>
            <p className="text-gray-400">
              Total Users: <span className="font-semibold text-white">{users.length}</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              
              <option value="USER">User</option>
            </select>
          </div>
        </div>


        <div className="flex gap-4">
  {/* <button
    onClick={() => {
      setSelectedUser(null);
      setIsPopupVisible(true);
    }}
    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
  >
    <Plus className="w-5 h-5" />
    Add New User
  </button> */}
</div>

        {/* Table */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={`${user.username}'s avatar`}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                          />
                          <div>
                            <div className="font-medium text-white">{user.username}</div>
                            <div className="text-xs text-gray-400">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleUpdate(user.id)}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors focus:outline-none"
                            title="Edit user"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={deletingUsers.has(user.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none"
                            title="Delete user"
                          >
                            {deletingUsers.has(user.id) ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      {searchTerm || selectedRole !== "all" ? (
                        <div className="flex flex-col items-center gap-2">
                          <UserX className="w-8 h-8" />
                          <p>No users found matching your filters.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Users className="w-8 h-8" />
                          <p>No users available.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isPopupVisible && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-gray-900 rounded-xl w-full max-w-md p-6 border border-blue-500/20 relative">
      <button
        onClick={() => {
          setIsPopupVisible(false);
          setSelectedUser(null);
        }}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        <X className="w-6 h-6" />
      </button>

      <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-blue-500" />
        {selectedUser ? "Edit User" : "Create New User"}
      </h3>

      <form onSubmit={handleSubmit(onSubmitUser)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            {...register("username", { required: "Username is required" })}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            {...register("role", { required: "Role is required" })}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="MODERATOR">Moderator</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <div>
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <div className="relative">
                <input
                  type="file"
                  onChange={(e) => {
                    field.onChange(e.target.files);
                    if (e.target.files?.[0]) {
                      setPreviewAvatarUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                  className="hidden"
                  id="user-avatar-upload"
                  accept="image/*"
                />
                <label
                  htmlFor="user-avatar-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  {selectedUser ? "Change Avatar" : "Upload Avatar"}
                </label>
              </div>
            )}
          />
          {previewAvatarUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Avatar Preview:</p>
              <img
                src={previewAvatarUrl}
                alt="Avatar preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-700 mx-auto"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          {selectedUser ? "Update User" : "Create User"}
        </button>
      </form>
    </div>
  </div>
)}
    </div>
  );
}