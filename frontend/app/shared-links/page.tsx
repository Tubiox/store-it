"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Link2, Eye, Download, Clock, Shield, Trash2, Copy, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const SharedLinksPage = () => {
    const [shares, setShares] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedToken, setCopiedToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchShares();
    }, []);

    const fetchShares = async () => {
        try {
            const data = await fetchWithAuth("/files/shares");
            setShares(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = async (token: string) => {
        const link = `${window.location.origin}/shared/${token}`;
        await navigator.clipboard.writeText(link);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    const revokeShare = async (token: string) => {
        try {
            await fetchWithAuth(`/files/share/revoke/${token}`, {
                method: "PUT",
            });

            setShares((prev) =>
                prev.map((share) =>
                    share.token === token ? { ...share, revoked: true } : share
                )
            );
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusBadge = (share: any) => {
        if (share.revoked) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 px-3 py-1 text-xs font-semibold">
                    <XCircle className="w-3.5 h-3.5" />
                    Revoked
                </span>
            );
        }
        if (new Date(share.expires_at) < new Date()) {
            return (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-600 px-3 py-1 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Expired
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                Active
            </span>
        );
    };

    const getPermissionBadge = (permission: string) => {
        const styles = {
            view: "bg-indigo-50 text-indigo-600",
            download: "bg-purple-50 text-purple-600",
        };
        return (
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${styles[permission as keyof typeof styles] || styles.view}`}>
                {permission === "download" ? <Download className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {permission.charAt(0).toUpperCase() + permission.slice(1)}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-slate-500 font-medium">Loading shared links...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Link2 className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-800">Shared Links</h1>
                        </div>
                        <p className="text-slate-500 text-sm">Monitor and manage your secure file sharing activity</p>
                    </div>

                    <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/40"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <Link2 className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{shares.length}</p>
                                <p className="text-xs text-slate-500">Total Shares</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{shares.filter(s => !s.revoked && new Date(s.expires_at) > new Date()).length}</p>
                                <p className="text-xs text-slate-500">Active Links</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Eye className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{shares.reduce((acc, s) => acc + (s.preview_count || 0), 0)}</p>
                                <p className="text-xs text-slate-500">Total Views</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Download className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-800">{shares.reduce((acc, s) => acc + (s.download_count || 0), 0)}</p>
                                <p className="text-xs text-slate-500">Downloads</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                    {shares.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                                <Link2 className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-medium">No shared links yet</p>
                            <p className="text-slate-400 text-sm mt-1">Share files from your dashboard to see them here</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200/60">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">File</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Shared With</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Permission</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Expires</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Views</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Downloads</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {shares.map((share, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                                        <Shield className="w-5 h-5 text-indigo-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800">{share.filename}</p>
                                                        <p className="text-xs text-slate-400 font-mono">{share.token.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600">{share.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getPermissionBadge(share.permission)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                                    <Clock className="w-4 h-4 text-slate-400" />
                                                    {new Date(share.expires_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700">
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                    {share.preview_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700">
                                                    <Download className="w-4 h-4 text-slate-400" />
                                                    {share.download_count || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(share)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => copyLink(share.token)}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                                                        title="Copy link"
                                                    >
                                                        {copiedToken === share.token ? (
                                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                        ) : (
                                                            <Copy className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                    {!share.revoked && (
                                                        <button
                                                            onClick={() => revokeShare(share.token)}
                                                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                            title="Revoke access"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SharedLinksPage;
