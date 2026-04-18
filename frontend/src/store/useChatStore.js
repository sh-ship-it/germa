import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
// import { useOptimistic } from "react";


export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundOn: JSON.parse(localStorage.getItem("isSoundOn")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundOn", !get().isSoundOn);
    set({ isSoundOn: !get().isSoundOn });
  },
  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempid = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempid,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    //immediately show the message in the UI
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData,
      );
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      set({ messages: messages });
      toast.error(error.response?.data?.message || "something went wrong");
    }
  },

  subscribeToMessages:()=>{
    const noticficationSound = new Audio("/sound/noticfication.mp3");
    const {selectedUser,isSoundOn} = get();
    if(!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    socket.on("newMessage",(newMessage)=>{
        const isMessageFromSelectedUser = newMessage.senderId ===selectedUser._id
    if(!isMessageFromSelectedUser) return;
        const currentMessages = get().messages;
        set({messages:[...currentMessages,newMessage]});  
        if(isSoundOn){
            noticficationSound.currentTime = 0 ;
            noticficationSound.play().catch((e)=>{console.log("error playing sound",e)});

        }
      
    });
  },
  unsubscribeFromMessages:()=>{
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

}));
