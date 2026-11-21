import { NavLink } from 'react-router-dom';

const links = [
  { to: '/cidades', label: 'Cidades' },
  { to: '/estradas', label: 'Estradas' },
  { to: '/rota', label: 'Calcular Rota' },
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-bold text-indigo-700">🗺️ Sistema de Rotas</h1>

        <nav className="flex gap-2">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}