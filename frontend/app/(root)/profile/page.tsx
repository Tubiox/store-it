"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Clock, Edit2, Save, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserData {
  $id: string;
  fullName: string;
  email: string;
  avatar?: string;
  accountId?: string;
  created_at?: string;
  ai_summary_enabled?: boolean;
}

const Profile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ fullName: "", ai_summary_enabled: true });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [togglingAISummary, setTogglingAISummary] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setUser(data);
        setEditData({ 
          fullName: data.fullName,
          ai_summary_enabled: data.ai_summary_enabled ?? true
        });
      } catch (err) {
        setError("Failed to load profile. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSaveChanges = async () => {
    if (!editData.fullName.trim()) {
      setError("Full name cannot be empty");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const res = await fetch("http://localhost:8000/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          fullName: editData.fullName,
          ai_summary_enabled: editData.ai_summary_enabled
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditData({ 
      fullName: user?.fullName || "",
      ai_summary_enabled: user?.ai_summary_enabled ?? true
    });
    setIsEditing(false);
    setError("");
  };

  const handleAISummaryToggle = async () => {
    if (!user) return;
    
    setTogglingAISummary(true);
    try {
      setError("");
      setSuccess("");
      
      const newValue = !user.ai_summary_enabled;
      const res = await fetch("http://localhost:8000/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          ai_summary_enabled: newValue
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update AI summary setting");
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditData({
        ...editData,
        ai_summary_enabled: updatedUser.ai_summary_enabled
      });
      setSuccess(`AI Summary ${newValue ? "enabled" : "disabled"} successfully!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update AI summary setting. Please try again.");
      console.error(err);
    } finally {
      setTogglingAISummary(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 lg:p-10 bg-slate-50 min-h-screen">
        <div className="flex items-center justify-center h-96">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full p-6 lg:p-10 bg-slate-50 min-h-screen">
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200/60">
          <p className="text-slate-600">Failed to load profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 lg:p-10 bg-slate-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Profile Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account information and security</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 lg:p-8 mb-6">
        {/* Profile Header with Avatar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8 pb-8 border-b border-slate-200/60">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-4xl font-bold text-white">
              {user.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{user.fullName}</h2>
            <p className="text-slate-500">{user.email}</p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors font-medium text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Fields */}
        <div className="space-y-6">
          {/* Full Name Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                placeholder="Enter your full name"
              />
            ) : (
              <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 font-medium flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                {user.fullName}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 font-medium flex items-center gap-2">
              <Mail className="w-5 h-5 text-slate-400" />
              {user.email}
            </div>
            <p className="text-xs text-slate-500 mt-2">Email cannot be changed</p>
          </div>

          {/* AI Summary Toggle */}
          <div className="pt-4 border-t border-slate-200/60">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">AI Summary</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {user.ai_summary_enabled ? "Enabled - Click AI button on files for summaries" : "Disabled - Enable to use AI summaries"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleAISummaryToggle}
                disabled={togglingAISummary}
                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
                  user.ai_summary_enabled 
                    ? "bg-indigo-600" 
                    : "bg-slate-300"
                } ${togglingAISummary ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-lg"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    user.ai_summary_enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Account ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Account ID</label>
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 font-mono text-sm flex items-center gap-2 break-all">
              <Shield className="w-5 h-5 text-slate-400 flex-shrink-0" />
              {user.$id}
            </div>
          </div>

          {/* Account Created Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Account Created</label>
            <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 font-medium flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              {user.created_at 
                ? new Date(user.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : 'N/A'
              }
            </div>
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="mt-8 pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 lg:p-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          Security & Privacy
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Change Password</h4>
              <p className="text-xs text-slate-500 mt-1">Update your password to keep your account secure</p>
            </div>
            <Button className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors font-medium text-sm">
              Update
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Two-Factor Authentication</h4>
              <p className="text-xs text-slate-500 mt-1">Add an extra layer of security to your account</p>
            </div>
            <Button className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors font-medium text-sm">
              Enable
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200/60">
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">Active Sessions</h4>
              <p className="text-xs text-slate-500 mt-1">Manage your active login sessions</p>
            </div>
            <Button className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors font-medium text-sm">
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
