export default function TimelineItem(props: any) {
    return (
        <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-date">{props.waktu}</div>
            <div className="timeline-content">
                <h3>{props.judul}</h3>
                <p>{props.children}</p>
            </div>
        </div>
    );
}