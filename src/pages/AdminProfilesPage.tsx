import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Trash2,
  Edit3,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Save,
  X
} from 'lucide-react';

interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
}

const API_URL = 'http://localhost:3000/api/admin/profiles';

const AdminProfilesPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'Data Entry'
  });

  const fetchProfiles = async () => {
    try {
      const response = await fetch(API_URL);
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
    return profiles.filter(profile =>
      profile.fullName.toLowerCase().includes(search.toLowerCase()) ||
      profile.email.toLowerCase().includes(search.toLowerCase()) ||
      profile.role.toLowerCase().includes(search.toLowerCase())
    );
  }, [profiles, search]);

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: 'Data Entry'
    });

    setEditingProfile(null);
  };

  const handleAddProfile = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error);
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

    try {
      const response = await fetch(
        `${API_URL}/${editingProfile.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        alert('Failed to update');
        return;
      }

      await fetchProfiles();
      resetForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      'Delete this profile?'
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

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
      password: '',
      phone: profile.phone || '',
      role: profile.role
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">
            Admin Profiles
          </h1>

          <p className="text-slate-500 mt-2">
            Manage all system users
          </p>
        </div>

        <div className="bg-[#005F54] text-white px-6 py-4 rounded-3xl">
          <p className="text-xs uppercase">
            Total Profiles
          </p>

          <h2 className="text-3xl font-black">
            {profiles.length}
          </h2>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white p-8 rounded-3xl border">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">
            {editingProfile
              ? 'Edit Profile'
              : 'Add Profile'}
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

          <input
            placeholder="Full Name"
            value={formData.fullName}
            onChange={e =>
              setFormData({
                ...formData,
                fullName: e.target.value
              })
            }
            className="p-4 rounded-2xl border"
          />

          <input
            placeholder="Email"
            value={formData.email}
            onChange={e =>
              setFormData({
                ...formData,
                email: e.target.value
              })
            }
            className="p-4 rounded-2xl border"
          />

          {!editingProfile && (
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={e =>
                setFormData({
                  ...formData,
                  password: e.target.value
                })
              }
              className="p-4 rounded-2xl border"
            />
          )}

          <input
            placeholder="Phone"
            value={formData.phone}
            onChange={e =>
              setFormData({
                ...formData,
                phone: e.target.value
              })
            }
            className="p-4 rounded-2xl border"
          />

          <select
            value={formData.role}
            onChange={e =>
              setFormData({
                ...formData,
                role: e.target.value
              })
            }
            className="p-4 rounded-2xl border"
          >
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Data Entry">Data Entry</option>
          </select>
        </div>

        <button
          onClick={
            editingProfile
              ? handleUpdateProfile
              : handleAddProfile
          }
          className="mt-6 px-8 py-4 bg-[#005F54] text-white rounded-2xl font-bold"
        >
          {editingProfile
            ? 'Update Profile'
            : 'Add Profile'}
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
            onChange={e => setSearch(e.target.value)}
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
            {filteredProfiles.map(profile => (
              <tr
                key={profile.id}
                className="border-t"
              >
                <td className="p-5 font-bold">
                  {profile.fullName}
                </td>

                <td className="p-5">
                  {profile.email}
                </td>

                <td className="p-5">
                  {profile.phone}
                </td>

                <td className="p-5">
                  {profile.role}
                </td>

                <td className="p-5">
                  <div className="flex justify-end gap-3">

                    <button
                      onClick={() =>
                        handleEdit(profile)
                      }
                      className="p-3 bg-blue-50 text-blue-600 rounded-xl"
                    >
                      <Edit3 size={18} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(profile.id)
                      }
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