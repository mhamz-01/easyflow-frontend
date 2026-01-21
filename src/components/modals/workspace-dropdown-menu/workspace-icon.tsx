// workspace icon for workspace listing item ⬆
const WorkspaceIcon = ({ character }: { character: string }) => {
  return (
    <span className="grid place-content-center min-w-8 h-8 bg-primary-blue text-white font-medium rounded uppercase">
      {character}
    </span>
  );
};

export default WorkspaceIcon;
