// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { updateProfile, updatePassword, updateEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../context/DarkModeContext";
import Layout from "../components/Layout";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form states
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Password visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // // For displaying current password (Note: This is for demonstration - in production you'd never store actual passwords)
    // const [userCurrentPassword, setUserCurrentPassword] = useState({ value: currentPassword, isMasked: true }); // Example password for demo

    const navigate = useNavigate();
    const { darkMode } = useDarkMode();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || "");
                setEmail(currentUser.email || "");

                // If displayName is empty, try to fetch from backend database
                if (!currentUser.displayName) {
                    try {
                        const token = await currentUser.getIdToken();
                        // const response = await fetch("http://localhost:5000/api/auth/profile", {
                        const response = await fetch("https://aistudyhelper-backend.onrender.com/api/auth/profile", {
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        if (response.ok) {
                            const data = await response.json();
                            if (data.user && data.user.name) {
                                setDisplayName(data.user.name);

                                // Also update Firebase displayName for future use
                                try {
                                    await updateProfile(currentUser, {
                                        displayName: data.user.name
                                    });
                                } catch (updateError) {
                                    console.warn("Failed to update Firebase displayName:", updateError);
                                }
                            }
                        }
                    } catch (error) {
                        console.warn("Failed to fetch profile from backend:", error);
                    }
                }
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Update display name in Firebase
            if (displayName !== user.displayName) {
                await updateProfile(user, { displayName });
            }

            // Update display name in backend database
            if (displayName !== (user.displayName || "")) {
                try {
                    const token = await user.getIdToken();
                    // const response = await fetch("http://localhost:5000/api/auth/profile", {
                    const response = await fetch("https://aistudyhelper-backend.onrender.com/api/auth/profile", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ name: displayName })
                    });

                    if (!response.ok) {
                        console.warn("Failed to update name in backend database");
                    }
                } catch (backendError) {
                    console.warn("Backend update failed:", backendError);
                    // Don't fail the whole operation if backend update fails
                }
            }

            // Update email if changed
            if (email !== user.email) {
                await updateEmail(user, email);
            }

            // Update password if provided
            if (newPassword) {
                if (newPassword !== confirmPassword) {
                    throw new Error("New passwords do not match");
                }

                // Validate strong password
                const minLength = 8;
                const hasUpperCase = /[A-Z]/.test(newPassword);
                const hasLowerCase = /[a-z]/.test(newPassword);
                const hasNumber = /[0-9]/.test(newPassword);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

                if (newPassword.length < minLength) {
                    throw new Error("Password must be at least 8 characters long");
                }
                if (!hasUpperCase) {
                    throw new Error("Password must contain at least one uppercase letter");
                }
                if (!hasLowerCase) {
                    throw new Error("Password must contain at least one lowercase letter");
                }
                if (!hasNumber) {
                    throw new Error("Password must contain at least one number");
                }
                if (!hasSpecialChar) {
                    throw new Error("Password must contain at least one special character (!@#$%^&*...)");
                }

                await updatePassword(user, newPassword);
            }

            setSuccess("Profile updated successfully!");
            setEditing(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            // Refresh user data
            setUser(auth.currentUser);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate("/login");
        } catch (error) {
            setError("Failed to sign out");
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (!user) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <Layout>
            <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="max-w-6xl mx-auto py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8 lg:mb-12">
                        <h1 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            User Profile
                        </h1>
                        <p className={`mt-2 sm:mt-3 lg:mt-4 text-base sm:text-lg lg:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Manage your account information and settings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
                        {/* Profile Card */}
                        <div className={`xl:col-span-1 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-4 sm:p-6`}>
                            <div className="text-center">
                                {/* Profile Avatar */}
                                <div className="mx-auto h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt="Profile"
                                            className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                                            {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {user.displayName || "User"}
                                </h2>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {user.email}
                                </p>

                                {/* Account Status */}
                                <div className="mt-4 space-y-2">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${user.emailVerified
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {user.emailVerified ? '✓ Email Verified' : '⚠ Email Not Verified'}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-6 space-y-3">
                                <button
                                    onClick={() => setEditing(!editing)}
                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {editing ? 'Cancel Edit' : 'Edit Profile'}
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Profile Information */}
                        <div className={`xl:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-4 sm:p-6`}>
                            {!editing ? (
                                /* View Mode */
                                <div>
                                    <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Account Information
                                    </h3>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Display Name
                                            </label>
                                            <p className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                                {user.displayName || "Not set"}
                                            </p>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Email Address
                                            </label>
                                            <p className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                                {user.email}
                                            </p>
                                        </div>

                                        {/* <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                User ID
                                            </label>
                                            <p className={`p-3 rounded-lg font-mono text-sm ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                                {user.uid}
                                            </p>
                                        </div> */}

                                        <div>
                                            <label className={`block text-sm font-medium pt-7 mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Account Created
                                            </label>
                                            <p className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                                {formatDate(user.metadata?.creationTime)}
                                            </p>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium pt-7 mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Last Sign In
                                            </label>
                                            <p className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                                {formatDate(user.metadata?.lastSignInTime)}
                                            </p>
                                        </div>

                                        {/* <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Current Password
                                            </label>
                                            <div className={`p-3 rounded-lg relative ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-900'}`}>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-mono">
                                                        {showCurrentPassword ? userCurrentPassword : "••••••••"}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className={`ml-3 p-1 rounded ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                                                    >
                                                        {showCurrentPassword ? (
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.467 8.467m1.411 1.411l4.242 4.242M8.467 8.467l-1.768-1.768" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            ) : (
                                /* Edit Mode */
                                <form onSubmit={handleUpdateProfile}>
                                    <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Edit Profile
                                    </h3>

                                    {error && (
                                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                            {success}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Display Name
                                            </label>
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    }`}
                                                placeholder="Enter your display name"
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                    ? 'bg-gray-700 border-gray-600 text-white'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                                    }`}
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                New Password (optional)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className={`w-full px-3 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                        ? 'bg-gray-700 border-gray-600 text-white'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                        }`}
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    {showNewPassword ? (
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.467 8.467m1.411 1.411l4.242 4.242M8.467 8.467l-1.768-1.768" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className={`w-full px-3 py-2 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode
                                                        ? 'bg-gray-700 border-gray-600 text-white'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                        }`}
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className={`absolute inset-y-0 right-0 pr-3 flex items-center ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                                                >
                                                    {showConfirmPassword ? (
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.467 8.467m1.411 1.411l4.242 4.242M8.467 8.467l-1.768-1.768" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex space-x-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                        >
                                            {loading ? 'Updating...' : 'Update Profile'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditing(false)}
                                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
