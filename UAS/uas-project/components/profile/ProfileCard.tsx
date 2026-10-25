export default function ProfileCard(props: any) {
  return (
    <article className={"pf-card " + (props.className || "")}>
      {props.children}
    </article>
  );
}