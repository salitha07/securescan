import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import Navbar from "../components/Navbar";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #060B18; font-family: 'Inter', system-ui, sans-serif; }

.profile-root {
    min-height: 100vh;
    padding: 108px 24px 60px;
    background:
        radial-gradient(circle at 12% 20%, rgba(0,229,255,0.07), transparent 30%),
        radial-gradient(circle at 88% 70%, rgba(139,92,246,0.08), transparent 34%),
        #060B18;
}
.profile-inner { width: 100%; max-width: 850px; margin: 0 auto; }
.profile-heading { margin-bottom: 26px; }
.profile-title { color: #F1F5F9; font-size: 30px; font-weight: 800; letter-spacing: -0.025em; }
.profile-sub { color: #475569; font-size: 14px; margin-top: 7px; }
.profile-grid { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 18px; align-items: start; }
.profile-card {
    background: rgba(14,21,40,0.82);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    padding: 24px;
    backdrop-filter: blur(18px);
}
.profile-summary { text-align: center; }
.profile-avatar {
    width: 88px; height: 88px; margin: 0 auto 16px;
    display: grid; place-items: center; border-radius: 24px;
    background: linear-gradient(135deg, #00B4D8, #7C3AED);
    color: white; font-size: 28px; font-weight: 800;
    box-shadow: 0 0 32px rgba(0,180,216,0.22);
}
.profile-name { color: #E2E8F0; font-size: 19px; font-weight: 700; word-break: break-word; }
.profile-email { color: #64748B; font-size: 12px; margin-top: 6px; word-break: break-all; }
.profile-role {
    display: inline-block; margin-top: 14px; padding: 4px 10px;
    color: #00E5FF; background: rgba(0,229,255,0.07);
    border: 1px solid rgba(0,229,255,0.15); border-radius: 999px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
}
.profile-stack { display: flex; flex-direction: column; gap: 18px; }
.profile-section-title { color: #E2E8F0; font-size: 17px; font-weight: 700; margin-bottom: 6px; }
.profile-section-sub { color: #475569; font-size: 12px; line-height: 1.55; margin-bottom: 20px; }
.profile-field { margin-bottom: 15px; }
.profile-label { display: block; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 7px; }
.profile-input {
    width: 100%; padding: 11px 13px; border-radius: 10px;
    color: #E2E8F0; background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08); outline: none;
    font: inherit; font-size: 14px;
    transition: border-color .2s, box-shadow .2s;
}
.profile-input:focus { border-color: rgba(0,229,255,.3); box-shadow: 0 0 0 3px rgba(0,229,255,.05); }
.profile-input:disabled { color: #475569; cursor: not-allowed; }
.profile-button {
    padding: 10px 16px; border: 0; border-radius: 9px;
    color: white; background: linear-gradient(135deg, #00B4D8, #7C3AED);
    font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
}
.profile-button:disabled { opacity: .5; cursor: not-allowed; }
.profile-alert { margin-bottom: 15px; padding: 10px 12px; border-radius: 9px; font-size: 12px; line-height: 1.45; }
.profile-alert.success { color: #6EE7B7; background: rgba(16,185,129,.08); border: 1px solid rgba(16,185,129,.18); }
.profile-alert.error { color: #FCA5A5; background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.18); }
.profile-loading { color: #64748B; text-align: center; padding: 80px 20px; }
@media (max-width: 720px) {
    .profile-grid { grid-template-columns: 1fr; }
    .profile-root { padding-left: 16px; padding-right: 16px; }
}
`;

function getErrorMessage(error, fallback) {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    return data?.message || data?.detail || fallback;
}

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    const [profileMessage, setProfileMessage] = useState(null);
    const [passwordMessage, setPasswordMessage] = useState(null);

    useEffect(() => {
        api.get("/profile")
            .then(({ data }) => {
                setProfile(data);
                setName(data.name || "");
            })
            .catch((error) => setProfileMessage({
                type: "error",
                text: getErrorMessage(error, "Failed to load profile"),
            }))
            .finally(() => setLoading(false));
    }, []);

    const initials = useMemo(() => {
        const parts = (profile?.name || profile?.email || "U").trim().split(/\s+/);
        return parts.slice(0, 2).map(part => part[0]?.toUpperCase()).join("") || "U";
    }, [profile]);

    const updateProfile = async (event) => {
        event.preventDefault();
        if (!name.trim()) {
            setProfileMessage({ type: "error", text: "Name is required" });
            return;
        }

        try {
            setSavingProfile(true);
            setProfileMessage(null);
            const { data } = await api.put("/profile", { name: name.trim() });
            setProfile(data);
            setName(data.name);
            setProfileMessage({ type: "success", text: "Profile updated successfully" });
        } catch (error) {
            setProfileMessage({ type: "error", text: getErrorMessage(error, "Failed to update profile") });
        } finally {
            setSavingProfile(false);
        }
    };

    const changePassword = async (event) => {
        event.preventDefault();
        setPasswordMessage(null);

        if (newPassword.length < 8) {
            setPasswordMessage({ type: "error", text: "New password must contain at least 8 characters" });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        try {
            setSavingPassword(true);
            const { data } = await api.put("/profile/password", { currentPassword, newPassword });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setPasswordMessage({ type: "success", text: data.message || "Password changed successfully" });
        } catch (error) {
            setPasswordMessage({ type: "error", text: getErrorMessage(error, "Failed to change password") });
        } finally {
            setSavingPassword(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <Navbar />
            <main className="profile-root">
                <div className="profile-inner">
                    <header className="profile-heading">
                        <h1 className="profile-title">Your profile</h1>
                        <p className="profile-sub">Manage your SecureScan account information and password.</p>
                    </header>

                    {loading ? (
                        <div className="profile-loading">Loading profile...</div>
                    ) : (
                        <div className="profile-grid">
                            <motion.aside className="profile-card profile-summary" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="profile-avatar">{initials}</div>
                                <div className="profile-name">{profile?.name || "SecureScan user"}</div>
                                <div className="profile-email">{profile?.email}</div>
                                <span className="profile-role">{profile?.role || "USER"}</span>
                            </motion.aside>

                            <div className="profile-stack">
                                <motion.section className="profile-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 }}>
                                    <h2 className="profile-section-title">Account information</h2>
                                    <p className="profile-section-sub">Update the name displayed on your account. Email is used for login and cannot be changed here.</p>
                                    {profileMessage && <div className={`profile-alert ${profileMessage.type}`}>{profileMessage.text}</div>}
                                    <form onSubmit={updateProfile}>
                                        <div className="profile-field">
                                            <label className="profile-label" htmlFor="profile-name">Full name</label>
                                            <input id="profile-name" className="profile-input" value={name} onChange={event => setName(event.target.value)} maxLength={100} required />
                                        </div>
                                        <div className="profile-field">
                                            <label className="profile-label" htmlFor="profile-email">Email</label>
                                            <input id="profile-email" className="profile-input" value={profile?.email || ""} disabled />
                                        </div>
                                        <button className="profile-button" disabled={savingProfile}>
                                            {savingProfile ? "Saving..." : "Save profile"}
                                        </button>
                                    </form>
                                </motion.section>

                                <motion.section className="profile-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .1 }}>
                                    <h2 className="profile-section-title">Change password</h2>
                                    <p className="profile-section-sub">Use at least 8 characters and choose a password you do not use elsewhere.</p>
                                    {passwordMessage && <div className={`profile-alert ${passwordMessage.type}`}>{passwordMessage.text}</div>}
                                    <form onSubmit={changePassword}>
                                        <div className="profile-field">
                                            <label className="profile-label" htmlFor="current-password">Current password</label>
                                            <input id="current-password" className="profile-input" type="password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} autoComplete="current-password" required />
                                        </div>
                                        <div className="profile-field">
                                            <label className="profile-label" htmlFor="new-password">New password</label>
                                            <input id="new-password" className="profile-input" type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} minLength={8} maxLength={72} autoComplete="new-password" required />
                                        </div>
                                        <div className="profile-field">
                                            <label className="profile-label" htmlFor="confirm-password">Confirm new password</label>
                                            <input id="confirm-password" className="profile-input" type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} minLength={8} maxLength={72} autoComplete="new-password" required />
                                        </div>
                                        <button className="profile-button" disabled={savingPassword}>
                                            {savingPassword ? "Changing..." : "Change password"}
                                        </button>
                                    </form>
                                </motion.section>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
