"use client";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/api";
import { useRouter } from "next/navigation";

const SharedLinksPage = () => {

    const [shares, setShares] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchShares();
    }, []);

    const fetchShares = async () => {
        try {
            const data = await fetchWithAuth(
                "/files/shares"
            );

            setShares(data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const revokeShare = async (token: string) => {
        try {

            await fetchWithAuth(
                `/files/share/revoke/${token}`,
                {
                    method: "PUT",
                }
            );

            setShares((prev) =>
                prev.map((share) =>
                    share.token === token
                        ? {
                            ...share,
                            revoked: true
                        }
                        : share
                )
            );

        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="p-10">
                Loading shared links...
            </div>
        );
    }

    return (
        <div className="p-8">

            <div className="mb-8 flex items-start justify-between">

                <div>
                    <h1 className="text-3xl font-bold">
                        Shared Links
                    </h1>

                    <p className="mt-2 text-sm text-neutral-500">
                        Monitor and manage protected file sharing activity.
                    </p>
                </div>

                <button
                    onClick={() => router.push("/")}
                    className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
                >
                    Back to Dashboard
                </button>
            </div>
            <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">

                <table className="w-full">

                    <thead className="bg-neutral-50">
                        <tr className="text-left text-sm text-neutral-500">

                            <th className="px-6 py-4">
                                File
                            </th>

                            <th className="px-6 py-4">
                                Shared With
                            </th>

                            <th className="px-6 py-4">
                                Permission
                            </th>

                            <th className="px-6 py-4">
                                Expiry
                            </th>

                            <th className="px-6 py-4">
                                Views
                            </th>

                            <th className="px-6 py-4">
                                Downloads
                            </th>

                            <th className="px-6 py-4">
                                Status
                            </th>

                            <th className="px-6 py-4">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>

                        {shares.map((share, index) => (

                            <tr
                                key={index}
                                className="border-t border-neutral-100 text-sm"
                            >

                                <td className="px-6 py-4 font-medium">
                                    {share.filename}
                                </td>

                                <td className="px-6 py-4 text-neutral-600">
                                    {share.email}
                                </td>

                                <td className="px-6 py-4">
                                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium">
                                        {share.permission}
                                    </span>
                                </td>

                                <td className="px-6 py-4 text-neutral-600">
                                    {
                                        new Date(
                                            share.expires_at
                                        ).toLocaleString()
                                    }
                                </td>

                                <td className="px-6 py-4">
                                    {share.preview_count}
                                </td>

                                <td className="px-6 py-4">
                                    {share.download_count}
                                </td>

                                <td className="px-6 py-4">

                                    {share.revoked ? (
                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-500">
                                            Revoked
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                                            Active
                                        </span>
                                    )}

                                </td>

                                <td className="px-6 py-4">

                                    {!share.revoked && (
                                        <button
                                            onClick={() =>
                                                revokeShare(
                                                    share.token
                                                )
                                            }
                                            className="rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white transition hover:opacity-80"
                                        >
                                            Revoke
                                        </button>
                                    )}

                                </td>

                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SharedLinksPage;