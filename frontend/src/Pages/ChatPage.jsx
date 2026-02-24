import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LoaderIcon , LogOutIcon } from "lucide-react";
function ChatPage() {
  const { logout } = useAuthStore();
  return (
    <div>
      <button
            className="text-slate-400 hover:text-slate-200 transition-colors"
            onClick={logout}
          >
            <LogOutIcon className="size-5" />
          </button>

    </div>
  );
}

export default ChatPage;
