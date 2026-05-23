import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Crown, User, Mail, Calendar, ChevronLeft, ChevronRight, Shield, UsersRound } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useLanguage } from "@/context/LanguageContext";
import { trpc } from "@/providers/trpc";
import { useUIStore } from "@/stores/useUIStore";

const ITEMS_PER_PAGE = 10;

export function AdminUsersPage() {
  const { isRTL } = useLanguage();
  const addToast = useUIStore((s) => s.addToast);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");

  // Real tRPC queries
  const adminStats = trpc.admin.stats.useQuery(undefined, { retry: false });
  const usersQuery = trpc.admin.users.list.useQuery(
    { page, limit: ITEMS_PER_PAGE, search: search || undefined },
    { retry: false }
  );
  const utils = trpc.useUtils();

  const updateRole = trpc.admin.users.updateRole.useMutation({
    onSuccess: () => {
      utils.admin.users.list.invalidate();
      utils.admin.stats.invalidate();
      addToast({ message: isRTL ? "تم تحديث الدور بنجاح" : "Role updated successfully", type: "success" });
    },
    onError: (err) => {
      addToast({ message: err.message, type: "error" });
    },
  });

  const stats = adminStats.data || { totalUsers: 0, oauthUsers: 0, localUsers: 0 };
  const allUsers = usersQuery.data || [];

  // Client-side role filter
  const filtered = roleFilter === "all"
    ? allUsers
    : allUsers.filter((u: any) => u.role === roleFilter);

  const adminCount = allUsers.filter((u: any) => u.role === "admin").length;
  const userCount = allUsers.filter((u: any) => u.role === "user").length;

  const handleRoleToggle = (user: any) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    updateRole.mutate({
      userId: user.id > 100000 ? user.id - 100000 : user.id,
      authType: user.authType,
      role: newRole,
    });
  };

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <AdminStatCard icon={UsersRound} label="Total Users" labelAr="المستخدمين" value={stats.totalUsers || allUsers.length} change={8.2} changeLabel={isRTL ? "+3 هذا الشهر" : "+3 this month"} color="#60a5fa" index={0} sparklineData={[60, 65, 62, 70, 68, 75, 80]} isRTL={isRTL} />
        <AdminStatCard icon={Crown} label="Admins" labelAr="المسؤولين" value={adminCount} color="#D4AF37" index={1} isRTL={isRTL} />
        <AdminStatCard icon={User} label="Regular Users" labelAr="المستخدمون العاديون" value={userCount} color="#22c55e" index={2} isRTL={isRTL} />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-[300px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder={isRTL ? "البحث في المستخدمين..." : "Search users..."}
            className="w-full h-10 rounded-lg text-[13px] placeholder-[#555] outline-none bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] focus:border-[rgba(212,175,55,0.3)] transition-colors ps-10 pe-4" />
        </div>
        <div className="flex gap-2">
          {(["all", "admin", "user"] as const).map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} className="px-3 py-2 rounded-lg text-[12px] font-medium transition-all"
              style={{ background: roleFilter === r ? "rgba(212, 175, 55, 0.1)" : "rgba(255, 255, 255, 0.03)", color: roleFilter === r ? "#D4AF37" : "#555", border: roleFilter === r ? "1px solid rgba(212, 175, 55, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)" }}>
              {r === "all" ? (isRTL ? "الكل" : "All") : r === "admin" ? (isRTL ? "مسؤول" : "Admin") : (isRTL ? "مستخدم" : "User")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.05)]">
              <th className="px-4 py-3 text-[10px] text-[#555] uppercase tracking-wider font-semibold text-start">{isRTL ? "المستخدم" : "User"}</th>
              <th className="px-4 py-3 text-[10px] text-[#555] uppercase tracking-wider font-semibold text-start">{isRTL ? "البريد" : "Email"}</th>
              <th className="px-4 py-3 text-[10px] text-[#555] uppercase tracking-wider font-semibold text-start">{isRTL ? "الدور" : "Role"}</th>
              <th className="px-4 py-3 text-[10px] text-[#555] uppercase tracking-wider font-semibold text-start">{isRTL ? "التوثيق" : "Auth"}</th>
              <th className="px-4 py-3 text-[10px] text-[#555] uppercase tracking-wider font-semibold text-start">{isRTL ? "الحالة" : "Status"}</th>
              <th className="px-4 py-3 text-[10px] text-[#555] uppercase tracking-wider font-semibold text-start">{isRTL ? "تاريخ التسجيل" : "Joined"}</th>
              <th className="px-4 py-3 text-[10px] text-[#555] uppercase tracking-wider font-semibold text-start">{isRTL ? "إجراء" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {usersQuery.isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[rgba(255,255,255,0.03)]">
                  <td colSpan={7} className="px-4 py-4"><div className="h-10 rounded-lg bg-[rgba(255,255,255,0.03)] animate-pulse" /></td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16">
                <User className="w-12 h-12 text-[#333] mx-auto mb-3" />
                <p className="text-[14px] text-[#555]">{isRTL ? "لا يوجد مستخدمين" : "No users found"}</p>
              </td></tr>
            ) : (
              filtered.map((u: any, i: number) => (
                <motion.tr key={`${u.authType}-${u.id}`} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                        style={{ background: u.role === "admin" ? "linear-gradient(135deg, #D4AF3720, #F0D87820)" : "rgba(96, 165, 250, 0.1)", border: u.role === "admin" ? "1px solid rgba(212, 175, 55, 0.2)" : "1px solid rgba(96, 165, 250, 0.15)", color: u.role === "admin" ? "#D4AF37" : "#60a5fa" }}>
                        {u.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <span className="text-[13px] font-medium flex items-center gap-1.5" style={{ color: "var(--nv-text-primary)" }}>{u.name} {u.role === "admin" && <Crown className="w-3 h-3 text-[#D4AF37]" />}</span>
                        <span className="text-[10px] text-[#555]">ID: {u.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1.5 text-[12px] text-[#888]">
                      <Mail className="w-3 h-3 text-[#555]" />{u.email || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ background: u.role === "admin" ? "rgba(212, 175, 55, 0.1)" : "rgba(96, 165, 250, 0.1)", color: u.role === "admin" ? "#D4AF37" : "#60a5fa", border: `1px solid ${u.role === "admin" ? "rgba(212, 175, 55, 0.2)" : "rgba(96, 165, 250, 0.15)"}` }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-[#888] uppercase">{u.authType}</td>
                  <td className="px-4 py-3.5"><StatusBadge status="active" pulse /></td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#555]">
                      <Calendar className="w-3 h-3" />{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleRoleToggle(u)}
                      disabled={updateRole.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all hover:brightness-110 disabled:opacity-50"
                      style={{ background: u.role === "admin" ? "rgba(239, 68, 68, 0.1)" : "rgba(212, 175, 55, 0.1)", color: u.role === "admin" ? "#ef4444" : "#D4AF37", border: `1px solid ${u.role === "admin" ? "rgba(239, 68, 68, 0.2)" : "rgba(212, 175, 55, 0.2)"}` }}
                    >
                      <Shield className="w-3 h-3" />
                      {u.role === "admin" ? (isRTL ? "إلغاء الأدمن" : "Demote") : (isRTL ? "ترقية لأدمن" : "Make Admin")}
                    </button>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-[11px] text-[#555]">{filtered.length} {isRTL ? "مستخدم" : "users"}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ccc] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
            <ChevronLeft className="w-4 h-4 rtl-flip" />
          </button>
          <span className="text-[11px] text-[#888] font-mono px-2">{page}</span>
          <button onClick={() => setPage(page + 1)} disabled={filtered.length < ITEMS_PER_PAGE} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ccc] hover:bg-[rgba(255,255,255,0.04)] disabled:opacity-30 transition-colors">
            <ChevronRight className="w-4 h-4 rtl-flip" />
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
