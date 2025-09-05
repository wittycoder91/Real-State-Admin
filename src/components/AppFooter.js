import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; 2025 Safehomi</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        Safehomi
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
