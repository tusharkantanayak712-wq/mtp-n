import { unstable_cache } from "next/cache";
import { connectDB } from "./mongodb";
import AppSettings from "@/models/AppSettings";

export const getAppSettings = unstable_cache(
    async () => {
        try {
            await connectDB();
            const settings = await AppSettings.findOne({}).lean();
            if (!settings) {
                return { maintenanceMode: false, mlbbWeeklyProvider: "1game" };
            }
            return {
                maintenanceMode: !!settings.maintenanceMode,
                mlbbWeeklyProvider: settings.mlbbWeeklyProvider || "1game"
            };
        } catch (error) {
            console.error("Error fetching app settings:", error);
            return { maintenanceMode: false, mlbbWeeklyProvider: "1game" };
        }
    },
    ["app-settings"],
    {
        tags: ["app-settings"],
        revalidate: 60, // Fallback revalidation (1 minute)
    }
);
