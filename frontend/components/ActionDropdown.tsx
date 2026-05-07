"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Share2,
  Trash2,
  Pencil,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Image from "next/image";
import { actionsDropdownItems } from "@/constants";
import { fetchWithAuth } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ActionDropdown = ({ file }: { file: CustomFile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.filename);
  const [isLoading, setIsLoading] = useState(false);


  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.filename);
    //   setEmails([]);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);
    let success = false;

    const actions = {
      rename: async () => {
        await fetchWithAuth(`/rename/${file._id}`, {
          method: "PUT",
          body: JSON.stringify({
            filename: name,
          }),
        });

        return { status: "success" };
      },
      delete: async () => {
        await fetchWithAuth(`/delete/${file._id}`, {
          method: "DELETE",
        });
        return { status: "success" };
      },
    };
    const result = await actions[action.value as keyof typeof actions]();
    if (result && result.status === "success") success = true;

    if (success) closeAllModals();

    setIsLoading(false);
  };
  const renderDialogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete{` `}
              <span className="delete-file-name">{file.filename}</span>?
            </p>
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/assets/icons/dots.svg"
            alt="dots"
            width={34}
            height={34}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[230px] rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl">
          <DropdownMenuLabel className="max-w-[200px] truncate px-3 py-2 text-sm font-semibold text-neutral-500">
            {file.filename}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />



          {actionsDropdownItems.map((actionItem) => {
            const icons = {
              download: (
                <Download
                  size={18}
                  className="shrink-0"
                  style={{
                    color: "#38bdf8",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />
              ),

              share: (
                <Share2
                  size={18}
                  className="shrink-0"
                  style={{
                    color: "#fb923c",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />
              ),

              rename: (
                <Pencil
                  size={18}
                  className="shrink-0"
                  style={{
                    color: "#8b5cf6",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />
              ),

              delete: (
                <Trash2
                  size={18}
                  className="shrink-0"
                  style={{
                    color: "#f43f5e",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />
              ),

              details: (
                <Info
                  size={18}
                  className="shrink-0"
                  style={{
                    color: "#737373",
                    strokeWidth: 2.2,
                    display: "block",
                  }}
                />
              ),
            };

            const content = (
              <div className="flex w-full items-center gap-3">
                {icons[actionItem.value as keyof typeof icons]}

                <span className="text-sm font-medium text-neutral-700">
                  {actionItem.label}
                </span>
              </div>
            );

            return (
              <DropdownMenuItem
                key={actionItem.value}
                className="cursor-pointer rounded-xl px-3 py-2 focus:bg-neutral-100"
                onClick={() => {
                  setAction(actionItem);

                  if (
                    ["rename", "share", "delete", "details"].includes(
                      actionItem.value
                    )
                  ) {
                    setIsModalOpen(true);
                  }
                }}
              >
                {actionItem.value === "download" ? (
                  <a
                    href={`http://localhost:8000/download/${file._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDialogContent()}
    </Dialog>
  );
};
export default ActionDropdown;
