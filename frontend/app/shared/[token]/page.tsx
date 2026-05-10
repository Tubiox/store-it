"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Shield, Download, Eye, AlertTriangle, Lock } from "lucide-react";

const SharedFilePage = () => {
    const { token } = useParams();

    const [file, setFile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [blurred, setBlurred] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && ["c", "s", "u", "p"].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
            if (e.key === "PrintScreen") {
                e.preventDefault();
                navigator.clipboard.writeText("");
                alert("Protected content detected.");
            }
            if (e.key === "F12") {
                e.preventDefault();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        const disableContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };
        document.addEventListener("contextmenu", disableContextMenu);
        return () => document.removeEventListener("contextmenu", disableContextMenu);
    }, []);

    useEffect(() => {
        const handleVisibility = () => {
            setBlurred(document.hidden);
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => document.removeEventListener("visibilitychange", handleVisibility);
    }, []);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const res = await fetch(`http://localhost:8000/files/shared/info/${token}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.detail || "Failed");
                }

                setFile(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
    }, [token]);

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">Loading protected file...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Access Error</h2>
                <p className="text-red-400">{error}</p>
            </div>
        );
    }

    return (
        <div className={`fixed inset-0 bg-slate-900 flex items-center justify-center transition-all duration-300 ${blurred ? "blur-3xl brightness-0" : ""}`}>
            {/* Security Badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <Shield className="w-5 h-5 text-indigo-400" />
                <span className="text-white/80 text-sm font-medium">Protected Content</span>
            </div>

            {/* Watermarks */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[
                    "top-[15%] left-[5%]",
                    "top-[45%] left-[30%]",
                    "bottom-[10%] right-[5%]",
                ].map((position, index) => (
                    <div
                        key={index}
                        className={`absolute ${position} rotate-[-25deg] text-white/10 text-2xl font-semibold leading-relaxed`}
                    >
                        <p>
                            Shared with:
                            <br />
                            {file.shared_with || "Protected User"}
                        </p>
                        <p className="mt-2 text-lg">
                            {new Date().toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Content */}
            {file.content_type?.startsWith("image") && (
                <img
                    src={file.preview_url}
                    className="max-w-full max-h-full object-contain select-none pointer-events-none"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                />
            )}

            {file.content_type?.includes("pdf") && (
                <div className="relative w-full h-screen flex justify-center items-center bg-slate-900 overflow-hidden">
                    <div
                        className="absolute inset-0 z-50"
                        onContextMenu={(e) => e.preventDefault()}
                        style={{ pointerEvents: "none" }}
                    />
                    <iframe
                        src={`${file.preview_url}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full"
                    />
                </div>
            )}

            {file.content_type?.startsWith("video") && (
                <video
                    controls
                    className="max-w-full max-h-full"
                >
                    <source src={file.preview_url} />
                </video>
            )}

            {/* Download Button */}
            {file.permission === "download" && (
                <a
                    href={file.download_url}
                    className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50"
                >
                    <Download className="w-5 h-5" />
                    Download File
                </a>
            )}

            {/* Permission Info */}
            <div className="fixed bottom-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span className="text-white/60 text-xs">
                    {file.permission === "download" ? "Download & View" : "View Only"} Access
                </span>
            </div>
        </div>
    );
};

export default SharedFilePage;
