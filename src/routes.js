import React from 'react'

// Real Estate Management
const RealEstateList = React.lazy(() => import('./views/realestate/RealEstateList'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/realestate', name: 'Real Estate Management', element: RealEstateList, exact: true },
  { path: '/realestate/list', name: 'Real Estate List', element: RealEstateList },
]

export default routes
