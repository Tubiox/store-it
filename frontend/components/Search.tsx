"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Thumbnail from "@/components/Thumbnail";
import FormattedDateTime from "@/components/FormattedDateTime";
import { fetchWithAuth } from "@/lib/api";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CustomFile[]>([]);
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";

  const router = useRouter();
  const path = usePathname();

  const [debouncedQuery] = useDebounce(query, 300);

  // =======================
  // FETCH FILES
  // =======================
  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setResults([]);
        setOpen(false);
        return;
      }

      try {
        const data = await fetchWithAuth("/files");

        const normalized = data.map((file: any) => ({
          ...file,
          name: file.filename,
          extension: file.filename?.split(".").pop(),
        }));

        const filtered = normalized.filter((file: any) =>
          file.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );
        setResults(filtered);
        setOpen(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchFiles();
  }, [debouncedQuery]);

  // =======================
  // RESET INPUT
  // =======================
  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);

  // =======================
  // CLICK ITEM
  // =======================
  const handleClickItem = (file: any) => {
    setOpen(false);
    setResults([]);

    router.push(
      `/${file.content_type?.includes("video") || file.content_type?.includes("audio")
        ? "media"
        : "files"}?query=${query}`
    );
  };

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />

        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file: any) => (
                <li
                  key={file._id}
                  className="flex items-center justify-between"
                  onClick={() => handleClickItem(file)}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      type={file.content_type}
                      extension={file.filename?.split(".").pop()}
                      url="" // optional
                      className="size-9 min-w-9"
                    />

                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.filename}
                    </p>
                  </div>

                  <FormattedDateTime
                    date={file.uploaded_at}
                    className="caption line-clamp-1 text-light-200"
                  />
                </li>
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;