export default function FeatureBox (props: any) {
    return (
        <div className="feature-box">
            <div className="feature-icon">
                <i className={props.icon}></i>
                <h4>{props.title}</h4>
                <p>{props.children}</p>
            </div>
        </div>
    );
}