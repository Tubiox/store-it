"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const SharedFilePage = () => {
    const { token } = useParams();

    const [file, setFile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [blurred, setBlurred] = useState(false);


    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // CTRL shortcuts
            if (
                e.ctrlKey &&
                ["c", "s", "u", "p"].includes(e.key.toLowerCase())
            ) {
                e.preventDefault();
            }

            // PrintScreen
            if (e.key === "PrintScreen") {
                e.preventDefault();

                navigator.clipboard.writeText("");

                alert("Screenshots are disabled.");
            }

            // F12
            if (e.key === "F12") {
                e.preventDefault();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const disableContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        document.addEventListener(
            "contextmenu",
            disableContextMenu
        );

        return () => {
            document.removeEventListener(
                "contextmenu",
                disableContextMenu
            );
        };
    }, []);

    useEffect(() => {
        const handleVisibility = () => {
            setBlurred(document.hidden);
        };

        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );
        };
    }, []);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/files/shared/info/${token}`
                );

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
            <div className="h-screen flex items-center justify-center text-lg">
                Loading shared file...
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center text-red-500 text-lg">
                {error}
            </div>
        );
    }

    return (
        <div
            className={`protected-content fixed inset-0 bg-black flex items-center justify-center transition-all duration-300 ${blurred ? "blur-3xl brightness-0" : ""
                }`}>


            {/* WATERMARK */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">

                {[
                    "top-[15%] left-[5%]",
                    "top-[45%] left-[30%]",
                    "bottom-[10%] right-[5%]",
                ].map((position, index) => (
                    <div
                        key={index}
                        className={`absolute ${position} rotate-[-25deg] text-white/20 text-2xl font-semibold leading-relaxed`}
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

            {/* IMAGE */}
            {
                file.content_type?.startsWith("image") && (
                    <img
                        src={file.preview_url}
                        className="max-w-full max-h-full object-contain select-none pointer-events-none"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                    />
                )
            }


            {file.content_type?.includes("pdf") && (
                <div className="relative w-full h-screen flex justify-center items-center bg-black overflow-hidden">

                    {/* Protection Overlay */}
                    <div
                        className="absolute inset-0 z-50"
                        onContextMenu={(e) => e.preventDefault()}
                        style={{ pointerEvents: "none" }}
                    />

                    {/* PDF */}
                    <iframe
                        src={`${file.preview_url}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full"
                    />
                </div>
            )}
            {/* VIDEO */}
            {
                file.content_type?.startsWith("video") && (
                    <video
                        controls
                        className="max-w-full max-h-full"
                    >
                        <source src={file.preview_url} />
                    </video>
                )
            }
        </div >
    );
};

export default SharedFilePage;