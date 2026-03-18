const ProfileCard = () => {
  return (
    <div
      className="
      flex items-center gap-3
      px-3 py-2
      rounded-xl
      transition
      hover:bg-[var(--surface-soft)]
      cursor-pointer
    "
    >
      {/* Avatar */}
      <img
        src="identity-icon.png"
        alt="Perfil"
        className="
          w-10 h-10
          rounded-full
          object-cover
          bg-[var(--surface-muted)]
        "
      />

      {/* Info */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold">Usuario</span>

        <span className="text-xs text-[var(--text-muted)]">240 QP</span>
      </div>
    </div>
  );
};

export default ProfileCard;
