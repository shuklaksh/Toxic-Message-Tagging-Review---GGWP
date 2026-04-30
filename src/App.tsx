import { MessageProvider } from "./context/MessageContext";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { QueueView } from "./components/QueueView";
import { ProcessedView } from "./components/ProcessedView";
import { TaggingModal } from "./components/TaggingModal";
import { Toast } from "./components/Toast";
import { useMessages } from "./context/MessageContext";

function AppShell() {
  const { state } = useMessages();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <Tabs />
      <main className="flex-1 px-4 md:px-8 py-6 max-w-screen-2xl mx-auto w-full">
        {state.activeTab === "queue" ? <QueueView /> : <ProcessedView />}
      </main>
      <TaggingModal />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <MessageProvider>
      <AppShell />
    </MessageProvider>
  );
}
