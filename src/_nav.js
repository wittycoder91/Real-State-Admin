import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilList } from '@coreui/icons'
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
]

export default _nav
