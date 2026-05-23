interface SortToggleProps {
 popularLabel: string;
 latestLabel: string;
 sort: "popular" | "latest";
 onToggle: () => void;
}

export function SortToggle({ popularLabel, latestLabel, sort, onToggle }: SortToggleProps) {
 const isPopular = sort === "popular";

 return (
 <button
 onClick={onToggle}
 className="flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-200"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 >
 <span className={`text-[14px] font-medium transition-colors duration-200 ${isPopular ? "text-[#D4AF37]" : "text-[#9CA3AF]"}`}>
 {popularLabel}
 </span>

 <div
 className="w-8 h-[18px] rounded-full relative cursor-pointer transition-colors duration-200"
 style={{
 background: isPopular ? "rgba(212, 175, 55, 0.3)" : "rgba(255, 255, 255, 0.1)",
 }}
 >
 <div
 className="w-[14px] h-[14px] rounded-full bg-[#D4AF37] absolute top-[2px] transition-all duration-200 ease-out"
 style={{ left: isPopular ? "2px" : "16px" }}
 />
 </div>

 <span className={`text-[14px] font-medium transition-colors duration-200 ${!isPopular ? "text-[#D4AF37]" : "text-[#9CA3AF]"}`}>
 {latestLabel}
 </span>
 </button>
 );
}
