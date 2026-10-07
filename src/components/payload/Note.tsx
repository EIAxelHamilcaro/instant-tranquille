interface NoteProps {
  title: string;
  text: string;
}

export default function Note({ title, text }: NoteProps) {
  return (
    <aside className="lit-note">
      <strong>{title}</strong>
      <p>{text}</p>
    </aside>
  );
}
