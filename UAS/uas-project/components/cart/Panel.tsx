import type { ReactNode } from "react";

interface PanelProps {
    title: string;
    action?: ReactNode;
    children: ReactNode;
    as?: "section" | "aside";
    className?: string;
}

export default function Panel({ title, action, children, as: Tag = "section", className = ""}: PanelProps) {
    return (
        <Tag className={`bg-light rounded-4 p-4 ${className}`}>
            <div className="d-flex justify-content-between align-items-center">
                <h2 className="h4 text-danger mb-0">{title}</h2>
                {action}
            </div>
            <hr className="border-3 w-100 border-danger" />
            {children}
        </Tag>
    )
}