import MessageItem from './MessageItem';
import './MessageList.css';

const GROUP_THRESHOLD_MS = 7 * 60 * 1000; // 7 minutes — same as Discord

export default function MessageList({ messages, sortOrder = 'asc' }) {
    if (!messages || messages.length === 0) {
        return (
            <div className="message-list message-list--empty">
                <p className="empty-text">No messages in this archive.</p>
            </div>
        );
    }

    // Sort by timestamp, direction controlled by sortOrder
    const sorted = [...messages].sort((a, b) => {
        const diff = new Date(a.timestamp) - new Date(b.timestamp);
        return sortOrder === 'asc' ? diff : -diff;
    });

    // Build grouped structure: each message knows if it starts a new group
    const enriched = sorted.map((msg, i) => {
        const prev = sorted[i - 1];
        const isGroupStart =
            !prev ||
            prev.authorTag !== msg.authorTag ||
            new Date(msg.timestamp) - new Date(prev.timestamp) > GROUP_THRESHOLD_MS;
        return { ...msg, isGroupStart };
    });

    return (
        <div className="message-list" role="log" aria-label="Archived messages">
            <div className="messages-start-divider">
                <span>Beginning of archived messages</span>
            </div>
            {enriched.map((msg) => (
                <MessageItem key={msg.messageId || `${msg.authorId}-${msg.timestamp}`} msg={msg} />
            ))}
            <div className="messages-end-spacer" />
        </div>
    );
}
