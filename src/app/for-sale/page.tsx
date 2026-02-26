import { redirect } from 'next/navigation'

export default function ForSaleRedirect() {
  // Redirect to Portsmouth search as default
  redirect('/for-sale/portsmouth')
}