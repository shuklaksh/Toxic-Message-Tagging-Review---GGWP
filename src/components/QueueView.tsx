import { useMessages } from "../context/MessageContext";
import { MessageTable } from "./MessageTable";

export function QueueView() {
  const { queueMessages } = useMessages();

  return (
    <section aria-label="Message Queue">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-200">
          Message Queue
        </h2>
        <span className="text-xs text-slate-500">
          Untagged messages appear first • sorted by ID
        </span>
      </div>

      <MessageTable
        messages={queueMessages}
        emptyMessage="No reports found. All messages may have been filtered out."
      />
    </section>
  );
}
