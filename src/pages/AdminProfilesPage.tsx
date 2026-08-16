import React, { useEffect, useMemo, useState } from "react";
import { Search, Trash2, Edit3, X } from "lucide-react";

interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
}

const API_URL = "/api/users";

const AdminProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "Data Entry",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const fetchProfiles = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filteredProfiles = useMemo(() => {
    const query = search.toLowerCase();

    return profiles.filter(
      (profile) =>
        profile.fullName.toLowerCase().includes(query) ||
        profile.email.toLowerCase().includes(query) ||
        profile.role.toLowerCase().includes(query),
    );
  }, [profiles, search]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "Data Entry",
    });

    setErrors({});
    setEditingProfile(null);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password
    // Only required when creating a profile
    if (!editingProfile) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter";
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Password must contain at least one number";
      }
    }

    // Phone
    if (formData.phone) {
      if (!/^\d+$/.test(formData.phone)) {
        newErrors.phone = "Phone number must contain only numbers";
      } else if (formData.phone.length !== 10) {
        newErrors.phone = "Phone number must be exactly 10 digits";
      }
    }

    // Role
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleAddProfile = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to create profile");
        return;
      }

      await fetchProfiles();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editingProfile) return;

    if (!validateForm()) return;

    try {
      const response = await fetch(`${API_URL}/${editingProfile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();

        alert(error.error || "Failed to update profile");
        return;
      }

      await fetchProfiles();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this profile?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();

        alert(error.error || "Failed to delete profile");
        return;
      }

      await fetchProfiles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);

    setFormData({
      fullName: profile.fullName,
      email: profile.email,
      password: "",
      phone: profile.phone || "",
      role: profile.role,
    });

    setErrors({});

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Admin Profiles</h1>

          <p className="text-slate-500 mt-2">Manage all system users</p>
        </div>

        <div className="bg-[#005F54] text-white px-6 py-4 rounded-3xl">
          <p className="text-xs uppercase">Total Profiles</p>

          <h2 className="text-3xl font-black">{profiles.length}</h2>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-3xl border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">
            {editingProfile ? "Edit Profile" : "Add Profile"}
          </h2>

          {editingProfile && (
            <button
              onClick={resetForm}
              className="p-2 bg-red-50 text-red-500 rounded-xl"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* FULL NAME */}
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  fullName: e.target.value,
                });

                setErrors({
                  ...errors,
                  fullName: undefined,
                });
              }}
              className={`w-full p-4 rounded-2xl border ${
                errors.fullName ? "border-red-500" : "border-slate-200"
              }`}
            />

            {errors.fullName && (
              <p className="text-red-500 text-sm mt-2">{errors.fullName}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  email: e.target.value,
                });

                setErrors({
                  ...errors,
                  email: undefined,
                });
              }}
              className={`w-full p-4 rounded-2xl border ${
                errors.email ? "border-red-500" : "border-slate-200"
              }`}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          {!editingProfile && (
            <div>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  });

                  setErrors({
                    ...errors,
                    password: undefined,
                  });
                }}
                className={`w-full p-4 rounded-2xl border ${
                  errors.password ? "border-red-500" : "border-slate-200"
                }`}
              />

              <p className="text-slate-400 text-xs mt-2">
                Minimum 8 characters with uppercase, lowercase and number.
              </p>

              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>
          )}

          {/* PHONE */}
          <div>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, "");

                setFormData({
                  ...formData,
                  phone: value,
                });

                setErrors({
                  ...errors,
                  phone: undefined,
                });
              }}
              className={`w-full p-4 rounded-2xl border ${
                errors.phone ? "border-red-500" : "border-slate-200"
              }`}
            />

            {errors.phone && (
              <p className="text-red-500 text-sm mt-2">{errors.phone}</p>
            )}
          </div>

          {/* ROLE */}
          <div>
            <select
              value={formData.role}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  role: e.target.value,
                });

                setErrors({
                  ...errors,
                  role: undefined,
                });
              }}
              className={`w-full p-4 rounded-2xl border ${
                errors.role ? "border-red-500" : "border-slate-200"
              }`}
            >
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Data Entry">Data Entry</option>
            </select>

            {errors.role && (
              <p className="text-red-500 text-sm mt-2">{errors.role}</p>
            )}
          </div>
        </div>

        <button
          onClick={editingProfile ? handleUpdateProfile : handleAddProfile}
          className="mt-6 px-8 py-4 bg-[#005F54] text-white rounded-2xl font-bold"
        >
          {editingProfile ? "Update Profile" : "Add Profile"}
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-5 rounded-3xl border">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search profiles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 p-4 rounded-2xl border"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-5 text-left">Name</th>
              <th className="p-5 text-left">Email</th>
              <th className="p-5 text-left">Phone</th>
              <th className="p-5 text-left">Role</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProfiles.map((profile) => (
              <tr key={profile.id} className="border-t">
                <td className="p-5 font-bold">{profile.fullName}</td>

                <td className="p-5">{profile.email}</td>

                <td className="p-5">{profile.phone || "-"}</td>

                <td className="p-5">{profile.role}</td>

                <td className="p-5">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEdit(profile)}
                      className="p-3 bg-blue-50 text-blue-600 rounded-xl"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(profile.id)}
                      className="p-3 bg-red-50 text-red-600 rounded-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProfiles.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-bold">
            No profiles found
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfilesPage;
