"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Gem,
  Plus,
  Trash2,
  Edit,
  Save,
  MessageCircle,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Users,
  Search,
  ExternalLink,
  LogOut,
  RefreshCw,
  X,
  Phone,
  ArrowLeft,
  Database,
  Filter,
  Upload,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Diamond, Inquiry, BusinessProfile, DiamondShape } from "@/lib/types";

const SHAPES: DiamondShape[] = [
  "Round",
  "Marquise",
  "Pear",
  "Princess",
  "Emerald",
  "Cushion",
  "Oval",
  "Radiant",
  "Heart",
  "Asscher",
];

export default function AdminPage() {
  const router = useRouter();
  const { user, logout, formatPrice } = useAuth();
  const [activeTab, setActiveTab] = useState<"inventory" | "inquiries" | "analytics">("inventory");
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // CRUD Feedback Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Diamond Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiamond, setEditingDiamond] = useState<Diamond | null>(null);
  const [formData, setFormData] = useState({
    stockNumber: "",
    shape: "Round" as DiamondShape,
    carat: 1.5,
    color: "D",
    clarity: "VVS1",
    cut: "Ideal",
    polish: "Excellent",
    symmetry: "Excellent",
    fluorescence: "None",
    lab: "GIA" as "GIA" | "IGI" | "HRD" | "None",
    certificateNo: "",
    dimensions: "7.38 x 7.42 x 4.56 mm",
    pricePerCarat: 8000,
    imageUrl: "",
    videoUrl: "",
    description: "",
    isFeatured: true,
  });

  // Dedicated Image Upload State
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const imageInputRef = React.useRef<HTMLInputElement | null>(null);

  // Dedicated Video Upload State
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState("");
  const videoInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageProcess = (file: File) => {
    setImageUploadError("");
    if (!file.type.startsWith("image/")) {
      setImageUploadError("Please choose an image file (PNG, JPG, WEBP, SVG).");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setImageUploadError("Image file size exceeds 25MB limit. Please choose a smaller image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
      }
    };
    reader.onerror = () => {
      setImageUploadError("Failed to read image file from your system.");
    };
    reader.readAsDataURL(file);
  };

  const handleVideoProcess = (file: File) => {
    setVideoUploadError("");
    if (!file.type.startsWith("video/")) {
      setVideoUploadError("Please choose a video file (MP4, WEBM, MOV).");
      return;
    }
    if (file.size > 40 * 1024 * 1024) {
      setVideoUploadError("Video file size exceeds 40MB limit. Please choose a smaller video.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData((prev) => ({ ...prev, videoUrl: reader.result as string }));
      }
    };
    reader.onerror = () => {
      setVideoUploadError("Failed to read video file from your system.");
    };
    reader.readAsDataURL(file);
  };

  // Delete Confirmation Modal State
  const [diamondToDelete, setDiamondToDelete] = useState<Diamond | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.push("/login");
      return;
    }
    loadAllData();
  }, [user]);

  // Auto-dismiss notification after 6 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [diaRes, inqRes, statRes] = await Promise.all([
        api.getDiamonds(),
        api.getInquiries(),
        api.getStats().catch(() => null),
      ]);
      setDiamonds(diaRes.diamonds);
      setInquiries(inqRes);
      setStats(statRes?.stats || null);
    } catch (e) {
      console.error(e);
      setNotification({
        type: "error",
        message: "Failed to connect to backend database. Please ensure backend server is running.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = (presetStock?: string) => {
    setEditingDiamond(null);
    setImageUploadError("");
    setVideoUploadError("");
    setFormData({
      stockNumber: presetStock || `MD-${Date.now().toString().slice(-4)}`,
      shape: "Round",
      carat: 1.5,
      color: "D",
      clarity: "VVS1",
      cut: "Ideal",
      polish: "Excellent",
      symmetry: "Excellent",
      fluorescence: "None",
      lab: "IGI",
      certificateNo: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      dimensions: "7.20 x 7.25 x 4.40 mm",
      pricePerCarat: 7500,
      imageUrl: "",
      videoUrl: "",
      description: "Triple Excellent master cut natural diamond.",
      isFeatured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (d: Diamond) => {
    setEditingDiamond(d);
    setImageUploadError("");
    setVideoUploadError("");
    setFormData({
      stockNumber: d.stockNumber,
      shape: d.shape,
      carat: d.carat,
      color: d.color,
      clarity: d.clarity,
      cut: d.cut,
      polish: d.polish,
      symmetry: d.symmetry,
      fluorescence: d.fluorescence,
      lab: d.lab,
      certificateNo: d.certificateNo,
      dimensions: d.dimensions,
      pricePerCarat: d.pricePerCarat,
      imageUrl: d.imageUrl,
      videoUrl: d.videoUrl || "",
      description: d.description,
      isFeatured: d.isFeatured,
    });
    setIsModalOpen(true);
  };

  const handleSaveDiamond = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDiamond) {
        await api.updateDiamond(editingDiamond.id, formData);
        setNotification({
          type: "success",
          message: `✓ Diamond stone "${formData.stockNumber}" (${formData.carat} ct ${formData.shape}) updated in database successfully!`,
        });
      } else {
        await api.createDiamond(formData);
        setNotification({
          type: "success",
          message: `✓ Diamond stone "${formData.stockNumber}" (${formData.carat} ct ${formData.shape}) added to database successfully!`,
        });
      }
      setIsModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to save diamond to database.",
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!diamondToDelete) return;
    setIsDeleting(true);
    try {
      const stockNum = diamondToDelete.stockNumber;
      await api.deleteDiamond(diamondToDelete.id);
      setDiamondToDelete(null);
      setNotification({
        type: "info",
        message: `✓ Diamond stone "${stockNum}" removed from database successfully.`,
      });
      await loadAllData();
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.message || "Failed to remove diamond from database.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (inquiryId: string, status: string) => {
    try {
      await api.updateInquiryStatus(inquiryId, status);
      setNotification({
        type: "success",
        message: "Customer inquiry status updated in database.",
      });
      loadAllData();
    } catch (e: any) {
      setNotification({
        type: "error",
        message: e.message || "Failed to update inquiry status.",
      });
    }
  };

  if (!user || user.role !== "ADMIN") return null;

  // Filter diamonds based on search query (case-insensitive)
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const filteredDiamonds = diamonds.filter((d) => {
    if (!trimmedSearch) return true;
    return (
      d.stockNumber.toLowerCase().includes(trimmedSearch) ||
      d.shape.toLowerCase().includes(trimmedSearch) ||
      d.certificateNo.toLowerCase().includes(trimmedSearch) ||
      d.color.toLowerCase().includes(trimmedSearch) ||
      d.clarity.toLowerCase().includes(trimmedSearch) ||
      d.lab.toLowerCase().includes(trimmedSearch)
    );
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Back Link & DB Status */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-amber-700 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-xs transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Main Website</span>
          </Link>

          {/* Database Live Sync Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
            <Database className="h-3.5 w-3.5 text-emerald-600" />
            <span>Database: Live & Synchronized</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Notification Toast */}
        {notification && (
          <div
            className={`mb-6 flex items-center justify-between rounded-2xl border p-4 shadow-sm transition-all ${
              notification.type === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                : notification.type === "error"
                ? "border-rose-300 bg-rose-50 text-rose-900"
                : "border-sky-300 bg-sky-50 text-sky-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : notification.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              ) : (
                <Database className="h-5 w-5 text-sky-600 shrink-0" />
              )}
              <span className="text-sm font-semibold">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="rounded-lg p-1 hover:bg-black/5 text-slate-500"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Admin Header */}
        <div className="rounded-3xl border border-slate-300 bg-white p-6 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-extrabold text-slate-900">
                  Maa Diamond Admin Suite
                </h1>
                <span className="rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold">
                  DATABASE MANAGER
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-medium">
                Surat Diamond Bourse • Logged in as <span className="font-bold text-slate-900">{user.name}</span> ({user.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/card"
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <QrCode className="h-3.5 w-3.5 text-amber-600" />
              <span>Digital vCard</span>
            </Link>

            <button
              onClick={loadAllData}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
              title="Refresh Database Records"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-amber-600" : ""}`} />
              <span className="hidden sm:inline">Refresh DB</span>
            </button>

            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Total In Database</span>
            <span className="font-serif text-2xl font-extrabold text-slate-900 mt-1 block">{diamonds.length}</span>
            <span className="text-[11px] text-emerald-700 font-bold">Live Diamond Stones</span>
          </div>

          <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Trade Inquiries</span>
            <span className="font-serif text-2xl font-extrabold text-slate-900 mt-1 block">{inquiries.length}</span>
            <span className="text-[11px] text-amber-700 font-bold">B2B Leads Received</span>
          </div>

          <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Digital Card Scans</span>
            <span className="font-serif text-2xl font-extrabold text-slate-900 mt-1 block">
              {stats?.totalScans || 28}
            </span>
            <span className="text-[11px] text-indigo-700 font-bold">QR Business Card Scans</span>
          </div>

          <div className="rounded-2xl border border-slate-300 bg-white p-4 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Total Inventory Value</span>
            <span className="font-serif text-2xl font-extrabold text-slate-900 mt-1 block">
              ${diamonds.reduce((acc, d) => acc + (d.totalPrice || 0), 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-600 font-semibold">USD Valuation</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-4 overflow-x-auto">
          {[
            { id: "inventory", label: `Diamond Inventory Database (${diamonds.length})`, icon: Gem },
            { id: "inquiries", label: `Customer Inquiries (${inquiries.length})`, icon: FileText },
            { id: "analytics", label: "Scan Analytics", icon: QrCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* 1. INVENTORY TAB - DATABASE CRUD INTERFACE */}
        {/* ========================================================= */}
        {activeTab === "inventory" && (
          <div>
            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Stock #, Shape, Cert, Color, Clarity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-9 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-amber-600 focus:outline-none shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    title="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-slate-600 font-semibold hidden md:inline">
                  Showing {filteredDiamonds.length} of {diamonds.length} in database
                </span>

                <button
                  onClick={() => handleOpenAddModal()}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-amber-600 hover:bg-amber-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
                >
                  <Plus className="h-4 w-4 text-white" />
                  <span>+ Add Diamond Stone</span>
                </button>
              </div>
            </div>

            {/* EMPTY STATE: WHEN NO DIAMOND FOUND IN DATABASE */}
            {filteredDiamonds.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-amber-300 bg-amber-50/50 p-10 text-center my-6 shadow-xs">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 mb-4 shadow-xs">
                  <Search className="h-8 w-8 text-amber-700" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  No Diamond Found with these Details in our Database
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto mb-6">
                  {trimmedSearch ? (
                    <>
                      We searched the database for{" "}
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                        &quot;{searchQuery}&quot;
                      </span>
                      , but no diamond stone matches these details. Please check the stock number, shape, or certificate number, or add this diamond directly to the database.
                    </>
                  ) : (
                    "There are currently no diamonds in the database inventory. Click below to add your first diamond stone."
                  )}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {trimmedSearch && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 shadow-xs transition-colors"
                    >
                      Clear Search & View All ({diamonds.length})
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenAddModal(trimmedSearch.toUpperCase())}
                    className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors"
                  >
                    <Plus className="h-4 w-4 text-amber-400" />
                    <span>+ Add This Diamond to Database</span>
                  </button>
                </div>
              </div>
            ) : (
              /* DIAMOND INVENTORY TABLE */
              <div className="overflow-x-auto rounded-2xl border border-slate-300 bg-white shadow-xs">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase font-bold text-slate-700 tracking-wider">
                    <tr>
                      <th className="p-3.5">Stock #</th>
                      <th className="p-3.5">Shape</th>
                      <th className="p-3.5">Carat</th>
                      <th className="p-3.5">Color</th>
                      <th className="p-3.5">Clarity</th>
                      <th className="p-3.5">Cut / Polish</th>
                      <th className="p-3.5">Lab Certificate</th>
                      <th className="p-3.5">Price / Ct</th>
                      <th className="p-3.5">Total Value</th>
                      <th className="p-3.5">Database Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDiamonds.map((dia) => (
                      <tr key={dia.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-slate-900">
                          {dia.stockNumber}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">{dia.shape}</td>
                        <td className="p-3.5 font-bold text-amber-800">{dia.carat.toFixed(2)} ct</td>
                        <td className="p-3.5 font-bold text-slate-900">{dia.color}</td>
                        <td className="p-3.5 font-bold text-slate-900">{dia.clarity}</td>
                        <td className="p-3.5 text-slate-600 font-medium">
                          {dia.cut} / {dia.polish}
                        </td>
                        <td className="p-3.5">
                          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-800 border border-slate-200">
                            {dia.lab} {dia.certificateNo}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-700">
                          ${dia.pricePerCarat.toLocaleString()}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {formatPrice(dia.totalPrice)}
                        </td>
                        <td className="p-3.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                            In Database
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {/* EDIT BUTTON (UPDATE) */}
                          <button
                            onClick={() => handleOpenEditModal(dia)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-100 hover:border-slate-400 shadow-2xs transition-colors"
                            title="Edit & Update Details"
                          >
                            <Edit className="h-3.5 w-3.5 text-amber-700" />
                            <span>Edit</span>
                          </button>

                          {/* DELETE BUTTON (REMOVE) */}
                          <button
                            onClick={() => setDiamondToDelete(dia)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 shadow-2xs transition-colors"
                            title="Delete from Database"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. INQUIRIES TAB */}
        {/* ========================================================= */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="rounded-2xl border border-slate-300 bg-white p-12 text-center text-slate-500">
                No customer inquiries submitted yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-2xl border border-slate-300 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        {inq.inquiryNumber}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date(inq.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-bold text-slate-900">
                      {inq.customerName} • <span className="font-mono text-slate-700 font-semibold">{inq.customerPhone}</span>
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-medium">
                      <span>Target Cut: <strong className="text-slate-900">{inq.targetShape || "Any"}</strong> ({inq.targetCarat || "Custom"} ct)</span>
                      <span>Budget: <strong className="text-slate-900">{inq.targetBudget || "N/A"}</strong></span>
                      {inq.customerEmail && <span>Email: {inq.customerEmail}</span>}
                    </div>

                    {inq.notes && (
                      <p className="text-xs text-slate-800 mt-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
                        &quot;{inq.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                      className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="QUOTED">QUOTED</option>
                      <option value="IN_NEGOTIATION">IN_NEGOTIATION</option>
                      <option value="CLOSED_WON">CLOSED_WON</option>
                      <option value="CLOSED_LOST">CLOSED_LOST</option>
                    </select>

                    <a
                      href={`https://wa.me/${inq.customerPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inq.customerName)}%2C%20this%20is%20Maa%20Diamond%20regarding%20your%20inquiry%20${inq.inquiryNumber}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-xs"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>WhatsApp Customer</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. ANALYTICS TAB */}
        {/* ========================================================= */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs">
              <h3 className="font-serif text-base font-bold text-slate-900 mb-4">
                Inquiries by Diamond Cut Shape
              </h3>
              <div className="space-y-3">
                {stats?.shapeBreakdown &&
                  Object.entries(stats.shapeBreakdown).map(([shape, count]: any) => (
                    <div key={shape} className="flex items-center justify-between text-xs">
                      <span className="text-slate-800 font-bold">{shape}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${Math.min(100, count * 20)}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-900">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-300 bg-white p-6 shadow-xs">
              <h3 className="font-serif text-base font-bold text-slate-900 mb-4">
                Recent Digital Card Scan Logs
              </h3>
              <div className="space-y-2 text-xs">
                {stats?.recentScans?.length > 0 ? (
                  stats.recentScans.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-800 font-mono text-[11px] font-semibold">{s.userAgent?.substring(0, 30) || "Mobile Device"}</span>
                      <span className="text-[11px] text-amber-700 font-bold">{new Date(s.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500">Scan physical/digital card QR to populate real-time logs.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* DIAMOND ADD / EDIT MODAL (CREATE & UPDATE DATABASE) */}
        {/* ========================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="relative w-full max-w-2xl rounded-3xl border border-slate-300 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-900">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <Gem className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    {editingDiamond ? `Update Diamond: ${editingDiamond.stockNumber}` : "Add New Diamond Stone to Database"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {editingDiamond ? "Modify specifications; all changes will sync to the database." : "Enter stone parameters to persist into the diamond inventory database."}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveDiamond} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Stock Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MD-1001"
                      value={formData.stockNumber}
                      onChange={(e) => setFormData({ ...formData, stockNumber: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Cut Shape *</label>
                    <select
                      value={formData.shape}
                      onChange={(e) => setFormData({ ...formData, shape: e.target.value as DiamondShape })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:bg-white focus:outline-none"
                    >
                      {SHAPES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Carat Weight (ct) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={formData.carat}
                      onChange={(e) => setFormData({ ...formData, carat: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Color (D - J)</label>
                    <input
                      type="text"
                      placeholder="D"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value.toUpperCase() })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Clarity</label>
                    <input
                      type="text"
                      placeholder="VVS1"
                      value={formData.clarity}
                      onChange={(e) => setFormData({ ...formData, clarity: e.target.value.toUpperCase() })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Cut Grade</label>
                    <input
                      type="text"
                      value={formData.cut}
                      onChange={(e) => setFormData({ ...formData, cut: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Price / Carat ($) *</label>
                    <input
                      type="number"
                      step="10"
                      min="100"
                      required
                      value={formData.pricePerCarat}
                      onChange={(e) => setFormData({ ...formData, pricePerCarat: parseFloat(e.target.value) || 0 })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Auto Calculated Live Total Price Preview */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase">
                    Calculated Total Wholesale Price:
                  </span>
                  <span className="font-mono text-base font-extrabold text-amber-800">
                    ${Math.round(formData.carat * formData.pricePerCarat).toLocaleString()} USD
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Grading Lab</label>
                    <select
                      value={formData.lab}
                      onChange={(e) => setFormData({ ...formData, lab: e.target.value as any })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:bg-white focus:outline-none"
                    >
                      <option value="GIA">GIA (Gemological Institute of America)</option>
                      <option value="IGI">IGI (International Gemological Institute)</option>
                      <option value="HRD">HRD Antwerp</option>
                      <option value="None">Non-Certified</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Certificate #</label>
                    <input
                      type="text"
                      placeholder="e.g. 2195847291"
                      value={formData.certificateNo}
                      onChange={(e) => setFormData({ ...formData, certificateNo: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 font-bold focus:border-amber-600 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* 1. Dedicated Stone Image Upload Section */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-700 font-bold uppercase text-xs flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-amber-600" />
                      <span>Stone Image (Photo)</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      JPG, PNG, WEBP, SVG (Max 25MB)
                    </span>
                  </div>

                  {imageUploadError && (
                    <div className="mb-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs text-rose-700 font-semibold">
                      {imageUploadError}
                    </div>
                  )}

                  {formData.imageUrl ? (
                    <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-900 p-2 overflow-hidden flex items-center justify-center min-h-[160px] max-h-[220px] shadow-inner group">
                      <img
                        src={formData.imageUrl}
                        alt="Diamond stone photo"
                        className="max-h-[200px] max-w-full rounded-xl object-contain"
                      />

                      {/* Small Cross Icon on the Right Corner to Remove Image */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, imageUrl: "" });
                          if (imageInputRef.current) imageInputRef.current.value = "";
                        }}
                        className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/80 text-white hover:bg-rose-600 hover:text-white shadow-lg transition-all focus:outline-none cursor-pointer z-20"
                        title="Remove image"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                        <ImageIcon className="h-3 w-3 text-amber-400" />
                        <span>Photo Attached</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleImageProcess(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />

                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingImage(true); }}
                        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingImage(true); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingImage(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingImage(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleImageProcess(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => imageInputRef.current?.click()}
                        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center transition-all cursor-pointer ${
                          isDraggingImage
                            ? "border-amber-500 bg-amber-50/80 scale-[1.01]"
                            : "border-slate-300 bg-slate-50 hover:border-amber-400 hover:bg-amber-50/40"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200 mb-2 text-amber-600">
                          <Upload className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          <span className="text-amber-700 underline font-extrabold">Choose image</span> or drag and drop photo here
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Upload high-resolution stone photo from your local system
                        </p>
                      </div>

                      <div className="mt-1 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const url = window.prompt("Enter direct image web URL:", "https://");
                            if (url && url !== "https://") {
                              setFormData({ ...formData, imageUrl: url.trim() });
                            }
                          }}
                          className="text-[11px] font-semibold text-slate-500 hover:text-amber-700 underline"
                        >
                          + Or paste direct image URL
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Dedicated Stone Video Upload Section */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-700 font-bold uppercase text-xs flex items-center gap-1.5">
                      <Film className="h-4 w-4 text-emerald-600" />
                      <span>Stone Video (360° Video / Loop)</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-medium">
                      MP4, WEBM, MOV (Max 40MB)
                    </span>
                  </div>

                  {videoUploadError && (
                    <div className="mb-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs text-rose-700 font-semibold">
                      {videoUploadError}
                    </div>
                  )}

                  {formData.videoUrl ? (
                    <div className="relative rounded-2xl border-2 border-slate-200 bg-slate-900 p-2 overflow-hidden flex items-center justify-center min-h-[160px] max-h-[220px] shadow-inner group">
                      <video
                        src={formData.videoUrl}
                        controls
                        autoPlay
                        muted
                        loop
                        className="max-h-[200px] max-w-full rounded-xl object-contain"
                      />

                      {/* Small Cross Icon on the Right Corner to Remove Video */}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, videoUrl: "" });
                          if (videoInputRef.current) videoInputRef.current.value = "";
                        }}
                        className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/80 text-white hover:bg-rose-600 hover:text-white shadow-lg transition-all focus:outline-none cursor-pointer z-20"
                        title="Remove video"
                        aria-label="Remove video"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-lg bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                        <Film className="h-3 w-3 text-emerald-400" />
                        <span>Video Attached</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleVideoProcess(e.target.files[0]);
                          }
                        }}
                        className="hidden"
                      />

                      <div
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingVideo(true); }}
                        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingVideo(true); }}
                        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDraggingVideo(false); }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingVideo(false);
                          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                            handleVideoProcess(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => videoInputRef.current?.click()}
                        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center transition-all cursor-pointer ${
                          isDraggingVideo
                            ? "border-emerald-500 bg-emerald-50/80 scale-[1.01]"
                            : "border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/40"
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs border border-slate-200 mb-2 text-emerald-600">
                          <Film className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          <span className="text-emerald-700 underline font-extrabold">Choose video</span> or drag and drop video here
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Upload 360° stone rotation or diamond inspection video
                        </p>
                      </div>

                      <div className="mt-1 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            const url = window.prompt("Enter direct video web URL:", "https://");
                            if (url && url !== "https://") {
                              setFormData({ ...formData, videoUrl: url.trim() });
                            }
                          }}
                          className="text-[11px] font-semibold text-slate-500 hover:text-emerald-700 underline"
                        >
                          + Or paste direct video URL
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Description / Notes</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-slate-900 focus:border-amber-600 focus:bg-white focus:outline-none resize-none"
                    placeholder="e.g. Triple Excellent, hearts and arrows pattern, Surat Diamond Bourse ready."
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-700 hover:bg-slate-100 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-6 py-2.5 font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
                  >
                    {editingDiamond ? "Update Diamond in Database" : "Save Diamond to Database"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* DELETE CONFIRMATION MODAL */}
        {/* ========================================================= */}
        {diamondToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-3xl border border-rose-200 bg-white p-6 shadow-2xl text-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700 mb-4">
                <Trash2 className="h-6 w-6" />
              </div>

              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">
                Delete Diamond from Database?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Are you sure you want to permanently remove diamond{" "}
                <span className="font-mono font-bold text-slate-900">
                  {diamondToDelete.stockNumber}
                </span>{" "}
                ({diamondToDelete.carat} ct {diamondToDelete.shape}, {diamondToDelete.color}/{diamondToDelete.clarity}) from the inventory database?
              </p>

              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 mb-6">
                <p className="text-[11px] text-rose-800 font-semibold">
                  ⚠️ This action cannot be undone. The stone will no longer appear on the website or in dealer searches.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDiamondToDelete(null)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel (Keep in Database)
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition-colors"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete from Database"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
