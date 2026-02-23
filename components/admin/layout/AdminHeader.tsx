'use client';

export default function AdminHeader() {
  return (
    <header className="admin-header">
      <div className="header-content">
        <h1>Admin Panel</h1>
        <div className="header-actions">
          <a href="/admin/login">Logout</a>
        </div>
      </div>
    </header>
  );
}
