import { Link } from "react-router-dom";

interface MenuItem {
  label: string;
  href: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    label: "UI",
    href: "#",
    children: [
      { label: "Layout", href: "#" },
      { label: "Router", href: "#" },
      { label: "Theme", href: "#" },
      { label: "Firebase", href: "#" },
      { label: "Authentication", href: "#" },
    ],
  },
  {
    label: "Manufacturers",
    href: "#",
  },
  {
    label: "Models",
    href: "#",
  },
  {
    label: "Vehicles",
    href: "#",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.label}>
            <Link
              to={item.href}
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              {item.label}
            </Link>
            {item.children && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.label}
                    to={child.href}
                    className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-md"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}