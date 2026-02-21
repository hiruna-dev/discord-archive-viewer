import './Header.css';

export default function Header({ archive, onReset }) {
    const { guildId, channelId, archivedAt, requestedBy, messages } = archive;

    const formattedDate = archivedAt
        ? new Date(archivedAt).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit',
        })
        : null;

    const channelDisplay = channelId || 'archive';
    const metaParts = [
        `${messages.length} message${messages.length !== 1 ? 's' : ''}`,
        requestedBy ? `Requested by ${requestedBy}` : null,
        formattedDate ? `Archived ${formattedDate}` : null,
    ].filter(Boolean).join(' • ');

    return (
        <header className="channel-header">
            <div className="header-left">
                {/* Hash icon */}
                <svg className="hash-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.222 0c.356 0 .67.189.853.499L20.222 0zm-4.929 8.51l.39-2.14H8.683L8.29 8.51h7.003zm1.748-9.595A.999.999 0 0 0 16 0H8a1 1 0 0 0-.97.764L5.06 8.51H3a1 1 0 1 0 0 2h1.69l-.89 4.88H2a1 1 0 1 0 0 2h1.44l-.594 3.262c-.07.393.14.786.51.961.38.18.83.09 1.12-.22l4.25-4h7.5l4.25 4c.29.31.74.4 1.12.22.37-.175.58-.568.51-.962L21.5 17.39H23a1 1 0 1 0 0-2h-1.8l-.89-4.88H22a1 1 0 1 0 0-2h-2.06l-.899-4.595z" />
                </svg>
                <div className="channel-info">
                    <span className="channel-name">#{channelDisplay}</span>
                    <span className="channel-meta">{metaParts}</span>
                </div>
            </div>
            <div className="header-right">
                {guildId && (
                    <span className="guild-badge" title={`Guild ID: ${guildId}`}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                        </svg>
                        {guildId}
                    </span>
                )}
                <button className="reset-btn" onClick={onReset} title="Load a different file" id="reset-button">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" />
                    </svg>
                    Load another file
                </button>
            </div>
        </header>
    );
}
