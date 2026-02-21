import { useMemo } from 'react';
import './MessageItem.css';

// Deterministic colour from username — same colours Discord uses for role-less names
const AVATAR_COLOURS = [
    '#5865f2', // blurple
    '#eb459e', // fuchsia
    '#57f287', // green
    '#fee75c', // yellow
    '#ed4245', // red
    '#00b0f4', // light blue
    '#f0b232', // amber
];

function getUserColor(tag) {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLOURS[Math.abs(hash) % AVATAR_COLOURS.length];
}

function getInitial(tag) {
    return (tag || '?').charAt(0).toUpperCase();
}

function formatTimestamp(ts, isGroupStart) {
    if (!ts) return '';
    const date = new Date(ts);
    const now = new Date();

    const sameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const wasYesterday =
        date.getFullYear() === yesterday.getFullYear() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getDate() === yesterday.getDate();

    const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (!isGroupStart) {
        // Compact inline timestamp shown on hover for non-group-start
        return timeStr;
    }

    if (sameDay) return `Today at ${timeStr}`;
    if (wasYesterday) return `Yesterday at ${timeStr}`;

    return date.toLocaleDateString('en-US', {
        month: '2-digit', day: '2-digit', year: 'numeric',
    }) + ' ' + timeStr;
}

export default function MessageItem({ msg }) {
    const { authorTag, content, timestamp, isGroupStart } = msg;
    const color = useMemo(() => getUserColor(authorTag || ''), [authorTag]);
    const initial = getInitial(authorTag);

    const fullTimestamp = useMemo(() => formatTimestamp(timestamp, true), [timestamp]);
    const shortTimestamp = useMemo(() => formatTimestamp(timestamp, false), [timestamp]);

    // Strip discriminator for display if it's #0 (new Discord usernames)
    const displayName = authorTag?.endsWith('#0')
        ? authorTag.slice(0, -2)
        : authorTag || 'Unknown User';

    return (
        <div className={`message-item ${isGroupStart ? 'message-item--group-start' : 'message-item--compact'}`}>
            {isGroupStart ? (
                // Full message with avatar
                <>
                    <div className="msg-avatar" style={{ backgroundColor: color }} aria-hidden="true">
                        {initial}
                    </div>
                    <div className="msg-content">
                        <div className="msg-header">
                            <span className="msg-author" style={{ color }}>{displayName}</span>
                            <span className="msg-timestamp" title={new Date(timestamp).toISOString()}>
                                {fullTimestamp}
                            </span>
                        </div>
                        <p className="msg-text">{content}</p>
                    </div>
                </>
            ) : (
                // Compact (continued) message — only show short timestamp on hover
                <>
                    <div className="msg-compact-time" aria-hidden="true">{shortTimestamp}</div>
                    <div className="msg-content">
                        <p className="msg-text">{content}</p>
                    </div>
                </>
            )}
        </div>
    );
}
