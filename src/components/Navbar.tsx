interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <div className="flex items-center justify-center px-5 py-4">
      <h1 className="text-sm font-bold tracking-widest text-gray-400 uppercase">{title}</h1>
    </div>
  );
}
