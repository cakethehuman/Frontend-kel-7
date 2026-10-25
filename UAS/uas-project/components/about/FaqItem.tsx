export default function FaqItem(props: any) {
    return (
        <div className={props.isOpen ? "faq-item active" : "faq-item"}>
            <button type="button" className="faq-header" onClick={props.onClick}>
                {props.judul}
                <i className="bx bx-chevron-down"></i>
            </button>
            <div className="faq-body">
                <p>{props.children}</p>
            </div>
        </div>
    );
}