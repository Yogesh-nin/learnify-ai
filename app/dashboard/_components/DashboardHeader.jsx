import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
function DashboardHeader({ onMenuClick }) {
  return (
    <div className="p-5 shadow-md flex justify-between items-center bg-surface border-b border-border">
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg text-foreground hover:bg-surface-hover"
        type="button"
        aria-label="Open menu"
      >
        <Menu size={30} />
      </button>
      <div className="flex-1 flex justify-end items-center">
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;
