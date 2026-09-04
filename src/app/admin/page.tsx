import { redirect } from 'next/navigation';

/** /admin — to'g'ridan-to'g'ri dashboardga yo'naltiradi */
export default function AdminIndexPage() {
  redirect('/admin/dashboard');
}
