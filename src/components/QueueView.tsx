import { useMessages } from "../context/MessageContext";
import { MessageTable } from "./MessageTable";
import { Filters } from "./Filters";

export function QueueView() {
  const { queueMessages } = useMessages();

  return (
    <section aria-label="Message Queue">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-200">
          Message Queue
        </h2>
      </div>

      <Filters mode="queue" />

      <MessageTable
        messages={queueMessages}
        emptyMessage="No reports found. Try clearing your filters."
      />
    </section>
  );
}
