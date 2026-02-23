'use client';

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <nav>
        <h3>Admin Menu</h3>
        <ul>
          <li><a href="/admin/dashboard">Dashboard</a></li>
          <li><a href="/admin/hero">Hero Slides</a></li>
          <li><a href="/admin/services">Services</a></li>
          <li><a href="/admin/about">About</a></li>
          <li><a href="/admin/testimonials">Testimonials</a></li>
          <li><a href="/admin/careers">Careers</a></li>
          <li><a href="/admin/quotes">Quote Requests</a></li>
          <li><a href="/admin/settings">Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
}
