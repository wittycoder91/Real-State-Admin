import React from 'react'

// Real Estate Management
const RealEstateList = React.lazy(() => import('./views/realestate/RealEstateList'))

// Contact Inquiries Management
const ContactInquiriesList = React.lazy(
  () => import('./views/contactinquiries/ContactInquiriesList'),
)

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/realestate', name: 'Real Estate Management', element: RealEstateList, exact: true },
  { path: '/realestate/list', name: 'Real Estate List', element: RealEstateList },
  {
    path: '/contactinquiries',
    name: 'Contact Inquiries Management',
    element: ContactInquiriesList,
    exact: true,
  },
  { path: '/contactinquiries/list', name: 'Contact Inquiries List', element: ContactInquiriesList },
]

export default routes
