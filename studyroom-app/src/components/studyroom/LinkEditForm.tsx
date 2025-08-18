import React, { useState, useEffect } from 'react';
import '../../styles/LinkEditForm.css';

interface LinkEditFormProps {
    channelName: string;
    initialUrl: string;
    onSubmit: (newUrl: string) => void;
}

const LinkEditForm: React.FC<LinkEditFormProps> = ({ channelName, initialUrl, onSubmit }) => {
    const [url, setUrl] = useState('');

    useEffect(() => {
        setUrl(initialUrl);
    }, [initialUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(url);
    };

    return (
        <form onSubmit={handleSubmit} className="link-edit-form">
            <h3>{channelName} 링크 수정</h3>
            <div className="form-group">
                <label htmlFor="channel-url">URL</label>
                <input
                    id="channel-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    required
                />
            </div>
            <button type="submit" className="submit-btn">저장하기</button>
        </form>
    );
};

export default LinkEditForm;