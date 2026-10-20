// src/lib/data/settings.ts — merges the `site_settings` row over site.config fallbacks.
// A column left empty in the dashboard falls back to the config value.
import { site } from "@/config/site";
import { publicDb, rows } from "@/lib/supabase/server";
import type { Settings } from "@/lib/types";

type SettingsRow = {
  meeting_summary: string;
  meeting_place: string;
  meeting_directions: string | null;
  cant_find_us_text: string | null;
  cant_find_us_phone: string | null;
  cant_find_us_email: string | null;
};

export async function getSettings(): Promise<Settings> {
  const db = publicDb();
  const row = db
    ? rows<SettingsRow | null>(await db.from("site_settings").select("*").eq("id", 1).maybeSingle(), "site_settings")
    : null;
  return {
    meetingSummary: row?.meeting_summary || site.meeting.time,
    meetingPlace: row?.meeting_place || site.meeting.place,
    meetingDirections: row?.meeting_directions || site.meeting.directions,
    cantFindUsText: row?.cant_find_us_text || "Text the facilitator on the day and someone will come find you.",
    cantFindUsPhone: row?.cant_find_us_phone || site.contact.phoneDisplay,
    cantFindUsEmail: row?.cant_find_us_email || site.contact.email,
  };
}
