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
      <div className="flex gap-2 items-center md:hidden">
        <img src="/logo-main.png" alt="logo" width={40} height={40} />
        <h2 className="font-bold text-2xl">Learnify</h2>
      </div>
      <div className="flex-1 flex justify-end items-center">
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;
