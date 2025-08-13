import {ScheduleEvent} from "../../data/mockData.ts";
import {useEffect, useState} from "react";
import '../../styles/EventForm.css';


interface EventFormProps {
    onSubmit: (eventData: Omit<ScheduleEvent, 'id'>) => void;
    initialDate?: Date;     // 날짜를 더블클릭 했을 때 전달받을 초기 날짜
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialDate }) => {
    const [title, setTitle] = useState('');
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);

    useEffect(() => {
        if (initialDate) {
            setStart(initialDate);
            const endDate = new Date(initialDate);
            endDate.setHours(endDate.getHours() + 1);
            setEnd(endDate);
        }
    }, [initialDate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !start || !end ) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        onSubmit({ title, start, end });
    };

    return (
        <form onSubmit={handleSubmit} className="event-form">
            <h3> 새 일정 등록 </h3>
            <div className="form-group">
                <label> 일정 등록 </label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
                <label> 시작 시간 </label>
                <input type="datetime-local" value={start ? new Date(start.getTime() - start.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => setStart(new Date(e.target.value))} required />
            </div>
            <div className="form-group">
                <label> 종료 시간 </label>
                <input type="datetime-local" value={end ? new Date(end.getTime() - end.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} onChange={e => setEnd(new Date(e.target.value))} required />
            </div>
            <button type="submit" className="submit-btn">등록하기</button>
        </form>
    );
};

export default EventForm;

