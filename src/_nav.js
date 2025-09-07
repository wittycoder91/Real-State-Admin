import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilList, cilUser } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavTitle,
    name: 'Real Estate Management',
  },
  {
    component: CNavItem,
    name: 'Real Estate List',
    to: '/realestate/list',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Contact Management',
  },
  {
    component: CNavItem,
    name: 'Contact List',
    to: '/contactinquiries/list',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _nav
