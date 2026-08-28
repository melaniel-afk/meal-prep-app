"use client";

import { useState, useTransition } from "react";
import Modal from "./Modal";
import { createClient } from "@/lib/supabase/client";
import { saveDiaryEntry } from "@/app/(app)/actions";
import type { Day, Tag } from "@/lib/types";

interface MediaState {
  url: string;
  isVideo: boolean;
  uploading: boolean;
}

export default function LogMealModal({
  day,
  slot,
  recipeId,
  recipeName,
  userId,
  initial,
  onClose,
}: {
  day: Day;
  slot: Tag;
  recipeId: string;
  recipeName: string;
  userId: string;
  initial: { actualEaten: string };
  onClose: () => void;
}) {
  const [eaten, setEaten] = useState<MediaState | null>(null);
  const [actualEaten, setActualEaten] = useState(initial.actualEaten);
  const [pending, startTransition] = useTransition();

  async function upload(file: File) {
    const isVideo = file.type.startsWith("video");
    setEaten({ url: "", isVideo, uploading: true });
    const supabase = createClient();
    const path = `${userId}/diary-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("meal-media").upload(path, file);
    if (error) {
      setEaten(null);
      return;
    }
    const { data } = supabase.storage.from("meal-media").getPublicUrl(path);
    setEaten({ url: data.publicUrl, isVideo, uploading: false });
  }

  const canSave = !!eaten?.url && !eaten.uploading && !pending;

  return (
    <Modal onClose={onClose}>
      <h2 className="mp-heading mb-1">Log this Meal</h2>
      <p className="mp-small mb-5">
        {recipeName} · {day} {slot}
      </p>

      <label className="block text-xs font-semibold text-[#8A8195] uppercase tracking-wide mb-2">
        What I Ate <span className="text-[#B9758F] normal-case">(required)</span>
      </label>
      <label className="flex flex-col items-center justify-center gap-2 min-h-[130px] rounded-2xl border-[1.5px] border-dashed border-[#D8C6EC] bg-[#FBF7F2] p-3 text-center cursor-pointer mb-5">
        <input
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
        />
        {eaten?.uploading && <span className="text-xs text-[#8A7A9C]">Uploading…</span>}
        {!eaten?.uploading && eaten?.url && eaten.isVideo && (
          <video src={eaten.url} muted className="w-full max-h-32 rounded-lg bg-black" />
        )}
        {!eaten?.uploading && eaten?.url && !eaten.isVideo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={eaten.url} alt="" className="w-full max-h-32 object-cover rounded-lg" />
        )}
        {!eaten && (
          <span className="text-xs font-semibold text-[#8A7A9C]">
            Tap to add a photo or video of what you ate
          </span>
        )}
      </label>

      <label className="block text-xs font-semibold text-[#8A8195] uppercase tracking-wide mb-2">
        Notes
      </label>
      <textarea
        value={actualEaten}
        onChange={(e) => setActualEaten(e.target.value)}
        rows={3}
        className="w-full rounded-xl border-[1.5px] border-[#E6DBF2] px-3.5 py-3 text-sm text-[#3A3245] mb-5 resize-y"
      />

      <button
        disabled={!canSave}
        onClick={() =>
          startTransition(async () => {
            if (!eaten?.url) return;
            await saveDiaryEntry({
              day,
              slot,
              recipeId,
              recipeName,
              eatenUrl: eaten.url,
              eatenIsVideo: eaten.isVideo,
              actualEaten,
            });
            onClose();
          })
        }
        className="w-full min-h-11 rounded-full bg-accent text-white text-sm font-semibold disabled:opacity-40"
      >
        {pending ? "Saving…" : "Save to Food Diary"}
      </button>
      {!eaten?.url && (
        <p className="text-[11px] text-[#B9758F] text-center mt-2">
          Add a photo or video of what you ate to save this entry.
        </p>
      )}
    </Modal>
  );
}
