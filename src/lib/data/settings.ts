// src/lib/data/settings.ts — merges the `site_settings` row over site.config fallbacks.
// TODO(supabase): .from('site_settings').select('*').eq('id', 1).single()
import { site } from "@/config/site";
import type { Settings } from "@/lib/types";

export async function getSettings(): Promise<Settings> {
  return {
    meetingSummary: site.meeting.time,
    meetingPlace: site.meeting.place,
    meetingDirections: site.meeting.directions,
    cantFindUsText: "Text the facilitator on the day and someone will come find you.",
    cantFindUsPhone: site.contact.phoneDisplay,
    cantFindUsEmail: site.contact.email,
  };
}
