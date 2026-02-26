import { redirect } from 'next/navigation'

export default function ToRentRedirect() {
  // Redirect to Portsmouth search as default
  redirect('/to-rent/portsmouth')
}