import MessagesLoader from "@/app/components/messagesLoader/MessagesLoader";

export default function Loading() {
  return (
    <main
      id="main_content"
      className="h-screen md:col-span-7 lg:col-span-8 bg-gradient-to-r from-gray-700 via-gray-900 to-black"
    >
      <MessagesLoader />
    </main>
  );
}
