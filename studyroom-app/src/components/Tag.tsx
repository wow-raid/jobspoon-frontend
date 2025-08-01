import React from 'react';
import '../styles/Tag.css';

interface TagProps {
    text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => {
    return (
        <span className="tag-component">
            {text}
        </span>
    );
};

export default Tag;