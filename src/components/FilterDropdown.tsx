import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FilterDropdownProps {
 label: string;
 categories: string[];
 selected: string;
 onSelect: (category: string) => void;
}

export function FilterDropdown({ label, categories, selected, onSelect }: FilterDropdownProps) {
 const [isOpen, setIsOpen] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
 if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
 setIsOpen(false);
 }
 };
 document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, []);

 return (
 <div ref={dropdownRef} className="relative">
 <button
 onClick={() => setIsOpen(!isOpen)}
 className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-all duration-200"
 style={{
 background: "rgba(255, 255, 255, 0.06)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.1)",
 boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
 }}
 >
 <span className="text-[#E0E0E0]">{selected === "All" ? label : selected}</span>
 <motion.div
 animate={{ rotate: isOpen ? 180 : 0 }}
 transition={{ duration: 0.2 }}
 >
 <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
 </motion.div>
 </button>

 <AnimatePresence>
 {isOpen && (
 <motion.div
 className="absolute top-full mt-1 z-50 rounded-lg overflow-hidden"
 style={{
 left: 0,
 right: "auto",
 background: "rgba(26, 26, 26, 0.95)",
 backdropFilter: "blur(20px)",
 border: "1px solid rgba(255, 255, 255, 0.08)",
 boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
 }}
 initial={{ opacity: 0, y: -4 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -4 }}
 transition={{ duration: 0.15 }}
 >
 <div className="max-h-[240px] overflow-y-auto py-1.5 custom-scrollbar">
 {categories.map((category) => (
 <button
 key={category}
 onClick={() => {
 onSelect(category);
 setIsOpen(false);
 }}
 className={`w-full text-left px-4 py-2.5 text-[14px] cursor-pointer transition-all duration-150 flex items-center gap-2 ${
 selected === category
 ? "text-[#D4AF37] font-medium"
 : "text-[#E0E0E0] hover:text-[#D4AF37]"
 }`}
 style={{
 background: selected === category ? "rgba(212, 175, 55, 0.08)" : "transparent",
 }}
 onMouseEnter={(e) => {
 if (selected !== category) {
 e.currentTarget.style.background = "rgba(212, 175, 55, 0.12)";
 }
 }}
 onMouseLeave={(e) => {
 if (selected !== category) {
 e.currentTarget.style.background = "transparent";
 }
 }}
 >
 {selected === category && (
 <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] flex-shrink-0" />
 )}
 {category}
 </button>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
