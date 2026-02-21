import { useState, useCallback } from 'react';
import DropZone from './components/DropZone';
import Header from './components/Header';
import MessageList from './components/MessageList';
import './App.css';

export default function App() {
    const [archive, setArchive] = useState(null);
    const [error, setError] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const toggleSort = () => setSortOrder(o => o === 'asc' ? 'desc' : 'asc');

    const handleFile = useCallback((file) => {
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const raw = JSON.parse(e.target.result);

                let archive;
                if (Array.isArray(raw)) {
                    // Bare messages array — wrap it
                    archive = {
                        channelName: null,
                        createdAt: null,
                        messages: raw,
                    };
                } else if (raw && Array.isArray(raw.data)) {
                    // New format: { channelName, createdAt, data }
                    archive = {
                        channelName: raw.channelName || null,
                        createdAt: raw.createdAt || null,
                        messages: raw.data,
                    };
                } else if (raw && Array.isArray(raw.messages)) {
                    // Legacy format
                    archive = {
                        channelName: raw.channelName || raw.channelId || null,
                        createdAt: raw.createdAt || raw.archivedAt || null,
                        messages: raw.messages,
                    };
                } else {
                    throw new Error('Invalid format: expected a messages array or an archive object.');
                }

                if (archive.messages.length === 0) {
                    throw new Error('This archive contains no messages.');
                }

                setArchive(archive);
            } catch (err) {
                setError(err.message || 'Failed to parse JSON file.');
                setArchive(null);
            }
        };
        reader.onerror = () => setError('Could not read the file.');
        reader.readAsText(file);
    }, []);

    const handleReset = () => {
        setArchive(null);
        setError(null);
    };

    return (
        <div className="app-shell">
            {archive ? (
                <div className="chat-layout">
                    <Header archive={archive} onReset={handleReset} sortOrder={sortOrder} onToggleSort={toggleSort} />
                    <MessageList messages={archive.messages} sortOrder={sortOrder} />
                </div>
            ) : (
                <div className="landing">
                    <DropZone onFile={handleFile} error={error} />
                </div>
            )}
        </div>
    );
}
