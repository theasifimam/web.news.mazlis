"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
    User,
    MapPin,
    Phone,
    Edit3,
    Twitter,
    Linkedin,
    Globe,
    ChevronLeft,
    Save,
    Loader2,
    Shield,
    Camera
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/lib/api/authApi";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/config";
import { setCredentials } from "@/lib/store/authSlice";

export default function ProfileSettingsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user: storeUser } = useAppSelector((state) => state.auth);
    const { data: profileRes, isLoading: profileLoading } = useGetProfileQuery(undefined, {
        skip: !isAuthenticated
    });
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const [formData, setFormData] = useState({
        fullName: "",
        bio: "",
        location: "",
        mNumber: "",
        socials: {
            twitter: "",
            linkedin: "",
            website: ""
        }
    });

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/profile");
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (profileRes?.data?.user) {
            const u = profileRes.data.user as any;
            setFormData({
                fullName: u.fullName || "",
                bio: u.bio || "",
                location: u.location || "",
                mNumber: u.mNumber || "",
                socials: {
                    twitter: u.socials?.twitter || "",
                    linkedin: u.socials?.linkedin || "",
                    website: u.socials?.website || ""
                }
            });
            if (u.avatar) {
                setAvatarPreview(getImageUrl(u.avatar));
            }
        }
    }, [profileRes]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof typeof prev] as any),
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('bio', formData.bio);
            data.append('location', formData.location);
            data.append('mNumber', formData.mNumber);
            data.append('socials', JSON.stringify(formData.socials));
            if (avatarFile) {
                data.append('avatar', avatarFile);
            }

            const res = await updateProfile(data).unwrap();
            if (res.success) {
                // Update local store to sync across components
                const token = localStorage.getItem("mazlis_token") || "";
                dispatch(setCredentials({ user: res.data.user, token }));

                toast.success("Profile updated successfully");
                router.push("/profile");
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to update profile");
        }
    };

    const inputClasses = "w-full bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-white/5 focus:border-zinc-400 dark:focus:border-zinc-600 transition-all text-zinc-900 dark:text-white placeholder:text-zinc-400";

    if (profileLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="animate-spin text-zinc-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 md:py-20">
                <div className="flex flex-col gap-12">
                    {/* Header */}
                    <div className="flex flex-col gap-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors w-fit"
                        >
                            <ChevronLeft size={16} />
                            Back to Profile
                        </button>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black font-outfit tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                                Account Settings.
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg mt-2">
                                Configure your editorial identity and digital presence.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-14">
                        {/* Avatar Upload Selection */}
                        <section className="flex flex-col items-center md:items-start gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl">
                                    <Camera size={18} />
                                </div>
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Visual Identity</h2>
                            </div>

                            <div className="relative group">
                                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-[3rem] overflow-hidden border-4 border-zinc-100 dark:border-zinc-800 shadow-2xl">
                                    {avatarPreview ? (
                                        <Image
                                            src={avatarPreview}
                                            alt="Avatar Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400">
                                            <User size={48} strokeWidth={1} />
                                        </div>
                                    )}

                                    <label className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-300">
                                        <Camera className="text-white" size={24} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Replace Photo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </label>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white dark:border-zinc-950 pointer-events-none">
                                    <Edit3 size={16} />
                                </div>
                            </div>
                        </section>

                        {/* Profile Section */}
                        <section className="flex flex-col gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl">
                                    <User size={18} />
                                </div>
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Core Identity</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Your full legal name"
                                        className={inputClasses}
                                    />
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Contact Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="mNumber"
                                            value={formData.mNumber}
                                            onChange={handleInputChange}
                                            placeholder="+1 234 567 890"
                                            className={`${inputClasses} pl-12`}
                                        />
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Location</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="London, United Kingdom"
                                            className={`${inputClasses} pl-12`}
                                        />
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Biography</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Tell the collective about yourself..."
                                        rows={4}
                                        className={`${inputClasses} resize-none`}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Social Presence */}
                        <section className="flex flex-col gap-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl">
                                    <Globe size={18} />
                                </div>
                                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400">Social Connections</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Twitter / X</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="socials.twitter"
                                            value={formData.socials.twitter}
                                            onChange={handleInputChange}
                                            placeholder="twitter.com/username"
                                            className={`${inputClasses} pl-12`}
                                        />
                                        <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">LinkedIn</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="socials.linkedin"
                                            value={formData.socials.linkedin}
                                            onChange={handleInputChange}
                                            placeholder="linkedin.com/in/username"
                                            className={`${inputClasses} pl-12`}
                                        />
                                        <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Website</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="socials.website"
                                            value={formData.socials.website}
                                            onChange={handleInputChange}
                                            placeholder="https://yourwebsite.com"
                                            className={`${inputClasses} pl-12`}
                                        />
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Submit */}
                        <div className="flex items-center justify-end gap-6 pt-10 border-t border-zinc-100 dark:border-zinc-900 mt-4">
                            <button
                                type="button"
                                onClick={() => router.push("/profile")}
                                className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                Cancel Changes
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-xl shadow-black/5 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={16} />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        Commit Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Security Footnote */}
                    <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 shadow-sm">
                            <Shield size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white mb-1">Secure Protocol</h3>
                            <p className="text-xs text-zinc-500 font-medium">Your editorial identity is protected by end-to-end encryption. Only public fields will be visible to other members of the collective.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
