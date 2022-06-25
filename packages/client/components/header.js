import Link from 'next/link'

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/sign-up' },
    !currentUser && { label: 'Sign In', href: '/auth/sign-in' },
    currentUser && { label: 'Sign Out', href: '/auth/sign-out' }
  ].filter(Boolean)

  return (
    <nav className="navbar navbar-light bg-light shadow-sm px-3">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {links.map(({ href, label }) => (
            <li key={href} className="nav-item">
              <Link href={href}>
                <a className="nav-link">{label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
