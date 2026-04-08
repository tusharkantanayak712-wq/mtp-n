"use client";

import { useState, useEffect } from "react";
import { FiSettings, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

const SettingsTab = () => {
    const [settings, setSettings] = useState({ maintenanceMode: false });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch("/api/admin/settings", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleMaintenance = async () => {
        try {
            setSaving(true);
            setMessage({ type: "", text: "" });
            const token = localStorage.getItem("token");
            const newValue = !settings.maintenanceMode;

            const res = await fetch("/api/admin/settings", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ maintenanceMode: newValue }),
            });

            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
                setMessage({ type: "success", text: `Maintenance mode ${newValue ? "enabled" : "disabled"}.` });
            } else {
                setMessage({ type: "error", text: data.message || "Could not update settings" });
            }
        } catch (err) {
            console.error("Failed to update settings", err);
            setMessage({ type: "error", text: "Something went wrong" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <FiLoader className="w-10 h-10 animate-spin text-[var(--accent)]" />
                <p className="text-[var(--muted)]">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
                    <FiSettings className="text-[var(--accent)]" />
                    Main Settings
                </h2>
                <p className="text-sm text-[var(--muted)] mt-1">
                    Manage website status and settings.
                </p>
            </div>

            <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl overflow-hidden">
                <div className="p-6 flex items-center justify-between gap-6 border-b border-[var(--border)]">
                    <div>
                        <h3 className="font-semibold text-[var(--foreground)]">Maintenance Mode</h3>
                        <p className="text-xs text-[var(--muted)] mt-1">
                            When enabled, users will see a maintenance message and cannot access the site.
                            You can still access the admin panel.
                        </p>
                    </div>

                    <button
                        onClick={toggleMaintenance}
                        disabled={saving}
                        className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none 
              ${settings.maintenanceMode ? "bg-[var(--accent)]" : "bg-gray-700"}
              ${saving ? "opacity-50 cursor-not-allowed" : ""}
            `}
                    >
                        <span
                            className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                ${settings.maintenanceMode ? "translate-x-5" : "translate-x-0"}
              `}
                        />
                    </button>
                </div>

                {message.text && (
                    <div className={`p-4 flex items-center gap-2 text-sm ${message.type === "success" ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}>
                        {message.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                        {message.text}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 opacity-50 cursor-not-allowed">
                {/* Placeholder for future settings */}
                <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                    <h4 className="text-xs font-bold uppercase text-[var(--muted)]">System Health</h4>
                    <p className="text-lg font-bold text-green-500">Optimal</p>
                </div>
                <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                    <h4 className="text-xs font-bold uppercase text-[var(--muted)]">Cache Status</h4>
                    <p className="text-lg font-bold text-[var(--foreground)]">Syncing...</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsTab;
