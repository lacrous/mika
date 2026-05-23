import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { siteSettings } from "@db/schema";
import { getDb } from "./queries/connection";
import { eq } from "drizzle-orm";

const DEFAULT_SETTINGS = {
  siteLanguage: "ar" as "ar" | "en",
  defaultTheme: "dark" as "dark" | "light",
  emailNotifications: true,
  reviewAlerts: true,
  newUserAlerts: false,
  autoApproveReviews: true,
  maintenanceMode: false,
  siteName: "NUROVIA",
  siteDescription: "Premium Anime Streaming Platform",
  maxUploadSize: 50,
  allowRegistration: true,
  requireEmailVerification: false,
};

async function getSettingsRecord(db: ReturnType<typeof getDb>) {
  const rows = await db.select().from(siteSettings).where(eq(siteSettings.key, "global")).limit(1);
  return rows[0] || null;
}

async function getMergedSettings(db: ReturnType<typeof getDb>) {
  const record = await getSettingsRecord(db);
  const stored = record?.value as Record<string, unknown> | undefined;
  return { ...DEFAULT_SETTINGS, ...(stored || {}) };
}

export const settingsRouter = createRouter({
  /* ── Get all settings (admin) ── */
  list: adminQuery.query(async () => {
    const db = getDb();
    return getMergedSettings(db);
  }),

  /* ── Update settings (admin) ── */
  update: adminQuery
    .input(z.object({
      siteLanguage: z.enum(["ar", "en"]).optional(),
      defaultTheme: z.enum(["dark", "light"]).optional(),
      emailNotifications: z.boolean().optional(),
      reviewAlerts: z.boolean().optional(),
      newUserAlerts: z.boolean().optional(),
      autoApproveReviews: z.boolean().optional(),
      maintenanceMode: z.boolean().optional(),
      siteName: z.string().optional(),
      siteDescription: z.string().optional(),
      maxUploadSize: z.number().optional(),
      allowRegistration: z.boolean().optional(),
      requireEmailVerification: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const current = await getMergedSettings(db);
      const merged = { ...current, ...input };
      const record = await getSettingsRecord(db);
      if (record) {
        await db.update(siteSettings).set({ value: merged, updatedAt: new Date() }).where(eq(siteSettings.key, "global"));
      } else {
        await db.insert(siteSettings).values({ key: "global", value: merged });
      }
      return { success: true, settings: merged };
    }),

  /* ── Reset to defaults (admin) ── */
  reset: adminQuery.mutation(async () => {
    const db = getDb();
    const record = await getSettingsRecord(db);
    if (record) {
      await db.update(siteSettings).set({ value: DEFAULT_SETTINGS, updatedAt: new Date() }).where(eq(siteSettings.key, "global"));
    } else {
      await db.insert(siteSettings).values({ key: "global", value: DEFAULT_SETTINGS });
    }
    return { success: true, settings: DEFAULT_SETTINGS };
  }),

  /* ── Get public settings (anyone) ── */
  public: publicQuery.query(async () => {
    const db = getDb();
    const settings = await getMergedSettings(db);
    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      siteLanguage: settings.siteLanguage,
      defaultTheme: settings.defaultTheme,
      maintenanceMode: settings.maintenanceMode,
      allowRegistration: settings.allowRegistration,
    };
  }),
});
