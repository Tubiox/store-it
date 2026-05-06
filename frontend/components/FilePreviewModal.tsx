"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    file: any;
}

const FilePreviewModal = ({
    open,
    onClose,
    file,
}: Props) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    if (!open) return null;

    const previewUrl = `http://localhost:8000/files/preview/${file._id}`;

    return (
        <div
            className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            {/* CONTENT */}
            <div
                className="relative w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 transition rounded-full p-2 text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* IMAGE */}
                {file.content_type?.startsWith("image") && (
                    <img
                        src={previewUrl}
                        alt={file.filename}
                        className="max-w-full max-h-full object-contain rounded-xl"
                    />
                )}

                {/* PDF */}
                {file.content_type === "application/pdf" && (
                    <div className="w-full h-[95vh] bg-neutral-900 rounded-xl overflow-hidden">
                        <iframe
                            src={`${previewUrl}#toolbar=1&navpanes=0`}
                            className="w-full h-[95vh]"
                        />
                    </div>
                )}

                {/* VIDEO */}
                {file.content_type?.startsWith("video") && (
                    <video
                        controls
                        className="max-w-full max-h-full rounded-xl"
                    >
                        <source src={previewUrl} />
                    </video>
                )}

                {/* FALLBACK */}
                {!file.content_type?.startsWith("image") &&
                    file.content_type !== "application/pdf" &&
                    !file.content_type?.startsWith("video") && (
                        <div className="text-white text-center">
                            <p className="text-xl font-semibold">
                                Preview not available
                            </p>

                            <p className="text-sm text-gray-300 mt-2">
                                This file type cannot be previewed.
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default FilePreviewModal;