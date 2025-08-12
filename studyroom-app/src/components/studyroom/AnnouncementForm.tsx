import React, { useState, useEffect } from 'react';
import '../../styles/AnnouncementForm.css'

interface AnnouncementFormProps {
    onSubmit: (formData: { title: string; content: string }) => void;
    initialData?: { title: string; content: string };
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSubmit, initialData }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()){
            alert('제목과 내용을 모두 입력해주세요.');
            return
        }
        onSubmit({ title, content });
    };

    return (
        <form onSubmit={handleSubmit} className="announcement-form">
            <h3 className="form-title"> 새 공지사항 작성 </h3>
            <div className="form-group">
                <label htmlFor="announcement-title"> 제목 </label>
                <input
                    id="announcement-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력해주세요."
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="announcement-content"> 내용 </label>
                <textarea
                    id="announcement-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력해주세요."
                    required
                />
            </div>
            <button type="submit" className="submit-btn"> 등록하기 </button>
        </form>
    );
};

export default AnnouncementForm;