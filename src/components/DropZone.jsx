import { useState, useRef, useCallback } from 'react';
import './DropZone.css';

export default function DropZone({ onFile, error }) {
    const [dragging, setDragging] = useState(false);
    const inputRef = useRef(null);

    const processFile = useCallback((file) => {
        if (!file) return;
        if (!file.name.endsWith('.json')) {
            // Still try — let App.jsx error handle it
        }
        onFile(file);
    }, [onFile]);

    const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = (e) => { e.preventDefault(); setDragging(false); };
    const onDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };
    const onInputChange = (e) => processFile(e.target.files[0]);

    return (
        <div className="dropzone-wrapper">
            {/* Logo / branding */}
            <div className="dropzone-brand">
                <svg className="dz-discord-logo" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Discord logo">
                    <path d="M60.105 4.898A58.549 58.549 0 0 0 45.653.415a.219.219 0 0 0-.232.11 40.784 40.784 0 0 0-1.8 3.697c-5.444-.815-10.86-.815-16.196 0a37.352 37.352 0 0 0-1.827-3.697.228.228 0 0 0-.232-.11A58.414 58.414 0 0 0 10.914 4.9a.207.207 0 0 0-.095.082C1.578 18.73-.944 32.144.293 45.39a.244.244 0 0 0 .093.166c6.073 4.46 11.956 7.167 17.729 8.953a.23.23 0 0 0 .249-.082 42.08 42.08 0 0 0 3.627-5.9.225.225 0 0 0-.123-.312 38.772 38.772 0 0 1-5.539-2.638.228.228 0 0 1-.022-.378 30.613 30.613 0 0 0 1.1-.862.22.22 0 0 1 .23-.031c11.62 5.305 24.198 5.305 35.68 0a.219.219 0 0 1 .232.028c.356.293.728.594 1.103.865a.228.228 0 0 1-.02.378 36.384 36.384 0 0 1-5.54 2.635.226.226 0 0 0-.12.315 47.249 47.249 0 0 0 3.623 5.897.225.225 0 0 0 .249.084c5.797-1.786 11.68-4.493 17.752-8.953a.228.228 0 0 0 .092-.163c1.48-15.315-2.48-28.618-10.497-40.411a.18.18 0 0 0-.093-.084ZM23.725 37.322c-3.497 0-6.38-3.211-6.38-7.156 0-3.944 2.827-7.156 6.38-7.156 3.583 0 6.437 3.24 6.38 7.156 0 3.945-2.826 7.156-6.38 7.156Zm23.593 0c-3.498 0-6.38-3.211-6.38-7.156 0-3.944 2.826-7.156 6.38-7.156 3.582 0 6.437 3.24 6.38 7.156 0 3.945-2.826 7.156-6.38 7.156Z" fill="currentColor" />
                </svg>
                <h1 className="dz-title">Discord Archive Viewer</h1>
                <p className="dz-subtitle">View your archived Discord messages</p>
            </div>

            {/* Drop zone box */}
            <div
                className={`dropzone-box${dragging ? ' dropzone-box--active' : ''}${error ? ' dropzone-box--error' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Drop JSON archive file here"
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".json,application/json"
                    style={{ display: 'none' }}
                    onChange={onInputChange}
                    id="json-file-input"
                />
                <div className="dz-icon-wrap">
                    {dragging ? (
                        <svg className="dz-icon dz-icon--drop" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                        </svg>
                    ) : (
                        <svg className="dz-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 13h8v1H8v-1zm0 3h5v1H8v-1z" />
                        </svg>
                    )}
                </div>
                <p className="dz-main-text">
                    {dragging ? 'Release to load archive' : 'Drop your JSON archive here'}
                </p>
                <p className="dz-sub-text">or <span className="dz-browse-link">click to browse</span></p>
                <p className="dz-hint">Exported from Discord Archive Bot</p>
            </div>

            {error && (
                <div className="dz-error" role="alert">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="dz-error-icon">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
