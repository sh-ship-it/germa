import { useChatStore } from "../store/useChatStore";

import Border from "../components/Border";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceHolder";


function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[800px] mx-auto">
      <Border>
        {/* Wrapper to ensure Flex behavior */}
        <div className="flex h-full w-full overflow-hidden">
          
          {/* LEFT SIDE */}
          <aside className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col border-r border-slate-700">
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </aside>

          {/* RIGHT SIDE */}
          <main className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </main>
          
        </div>
      </Border>
    </div>
  );
}
export default ChatPage;