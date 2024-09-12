"use client";

import ChatGroupList from "@/components/chatgroup-list";
import CreateGroupChatDialog from "@/components/dialog/create-chat-group-dialog";
import HomeHeader from "@/components/home-header";

export default function Page() {
  return (
    <>
      <HomeHeader />
      <div className="p-8">
        <h1 className="text-4xl">WELCOME TO RALERIS</h1>
          <CreateGroupChatDialog />

        <div className="flex flex-col mt-4">
          <h3 className="text-2xl text-muted-foreground">Chats</h3>
          <ChatGroupList />
        </div>
      </div>
    </>
  );
}
