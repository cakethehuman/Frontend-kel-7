import type { ReactNode } from "react";

interface TimelineItemProps {
  waktu: string;
  judul: string;
  children: ReactNode;
}

export default function TimelineItem(props: TimelineItemProps) {
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