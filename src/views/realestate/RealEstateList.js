import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CAlert,
  CBadge,
  CImage,
  CSpinner,
  CCarousel,
  CCarouselItem,
  CCarouselCaption,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLayers, cilTrash, cilCheck, cilX, cilHome } from '@coreui/icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import api from 'src/services'
import { API_URLS } from 'src/config/Constants'
import { showSuccessMsg, showWarningMsg, showErrorMsg } from 'src/config/common'

const RealEstateList = () => {
  const [realEstates, setRealEstates] = useState([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [deletingProperty, setDeletingProperty] = useState(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' })
  const [activeIndex, setActiveIndex] = useState(0)

  // Load real estates from API on component mount
  useEffect(() => {
    getRealEstates()
  }, [])

  const getRealEstates = async () => {
    try {
      setLoading(true)
      const response = await api.get(API_URLS.GETREALESTATE)

      if (response.data.success) {
        setRealEstates(response.data.data || [])
      } else {
        showWarningMsg(response.data.message)
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (property) => {
    try {
      setLoading(true)
      const response = await api.get(`${API_URLS.GETREALESTATEBYID}/${property._id}`)

      if (response.data.success) {
        setSelectedProperty(response.data.data)
        setActiveIndex(0) // Reset to first image
        setShowDetailModal(true)
      } else {
        showWarningMsg(response.data.message)
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (property) => {
    setDeletingProperty(property)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await api.delete(`${API_URLS.DELETEREALESTATE}/${deletingProperty._id}`)

      if (response.data.success) {
        showSuccessMsg(response.data.message)
        setShowDeleteModal(false)
        setDeletingProperty(null)
        getRealEstates() // Refresh the list
      } else {
        showWarningMsg(response.data.message)
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg(error.message)
      }
    }
  }

  const handleToggleStatus = async (propertyId) => {
    try {
      const property = realEstates.find((p) => p._id === propertyId)
      const newStatus = !property.status

      const response = await api.post(`${API_URLS.UPDATERALESTATESTATUS}/${propertyId}`, {
        status: newStatus,
      })

      if (response.data.success) {
        showSuccessMsg(`Property ${newStatus ? 'activated' : 'deactivated'} successfully!`)
        getRealEstates() // Refresh the list
      } else {
        showWarningMsg(response.data.message)
      }
    } catch (error) {
      if (error.response?.data?.msg) {
        showErrorMsg(error.response.data.msg)
      } else {
        showErrorMsg(error.message)
      }
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow className="align-items-center">
              <CCol>
                <h4 className="mb-0">Real Estate Management</h4>
                <p className="text-medium-emphasis">Manage and view all real estate properties</p>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            {alert.show && (
              <CAlert
                color={alert.color}
                dismissible
                onClose={() => setAlert({ show: false, message: '', color: 'success' })}
              >
                {alert.message}
              </CAlert>
            )}

            {loading ? (
              <div className="text-center py-5">
                <CSpinner color="primary" />
                <p className="text-medium-emphasis mt-2">Loading properties...</p>
              </div>
            ) : realEstates.length === 0 ? (
              <div className="text-center py-5">
                <CIcon icon={cilHome} size="3xl" className="text-medium-emphasis mb-3" />
                <p className="text-medium-emphasis">No properties found.</p>
              </div>
            ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Property</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Bedrooms</CTableHeaderCell>
                    <CTableHeaderCell>Bathrooms</CTableHeaderCell>
                    <CTableHeaderCell>Square Footage</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {realEstates.map((property) => (
                    <CTableRow key={property._id}>
                      <CTableDataCell>
                        <strong>{property.address}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info" className="text-capitalize">
                          {property.propertyType}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="secondary">{property.bedrooms}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="secondary">{property.bathrooms}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="secondary">{property.squareFootage}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong className="text-success">{formatPrice(property.price)}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color={property.status ? 'success' : 'secondary'}
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(property._id)}
                          className="d-flex align-items-center gap-1"
                        >
                          <CIcon icon={property.status ? cilCheck : cilX} />
                          {property.status ? 'Active' : 'Inactive'}
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handleViewDetails(property)}
                            className="d-flex align-items-center gap-1"
                          >
                            <CIcon icon={cilLayers} />
                            View
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(property)}
                            className="d-flex align-items-center gap-1"
                          >
                            <CIcon icon={cilTrash} />
                            Delete
                          </CButton>
                        </div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Real Estate Detail Modal */}
      <CModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedProperty(null)
          setActiveIndex(0)
        }}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Real Estate Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedProperty && (
            <CRow>
              <CCol xs={12} md={6}>
                <h5>Property Information</h5>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Address:</strong>
                      </td>
                      <td>{selectedProperty.address}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Type:</strong>
                      </td>
                      <td>
                        <CBadge color="info" className="text-capitalize">
                          {selectedProperty.propertyType}
                        </CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Bedrooms:</strong>
                      </td>
                      <td>{selectedProperty.bedrooms}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Bathrooms:</strong>
                      </td>
                      <td>{selectedProperty.bathrooms}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Square Footage:</strong>
                      </td>
                      <td>{selectedProperty.squareFootage} sq ft</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Price:</strong>
                      </td>
                      <td>
                        <strong className="text-success">
                          {formatPrice(selectedProperty.price)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Status:</strong>
                      </td>
                      <td>
                        <CBadge color={selectedProperty.status ? 'success' : 'secondary'}>
                          {selectedProperty.status ? 'Active' : 'Inactive'}
                        </CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>User Email:</strong>
                      </td>
                      <td>{selectedProperty.userEmail}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Created:</strong>
                      </td>
                      <td>{formatDate(selectedProperty.createdAt)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Updated:</strong>
                      </td>
                      <td>{formatDate(selectedProperty.updatedAt)}</td>
                    </tr>
                  </tbody>
                </table>
              </CCol>
              <CCol xs={12} md={6}>
                <h5>Description</h5>
                <div className="border rounded p-3 mb-3" style={{ minHeight: '200px' }}>
                  <p>{selectedProperty.description || 'No description provided'}</p>
                </div>

                <h5>Images</h5>
                {selectedProperty.images && selectedProperty.images.length > 0 ? (
                  <div className="position-relative">
                    <CCarousel
                      activeIndex={activeIndex}
                      onSelect={setActiveIndex}
                      controls={true}
                      indicators={true}
                      interval={false}
                    >
                      {selectedProperty.images.map((image, index) => (
                        <CCarouselItem key={index}>
                          <CImage
                            src={`${process.env.REACT_APP_UPLOAD_URL}${image}`}
                            alt={`Property image ${index + 1}`}
                            className="d-block w-100 rounded"
                            style={{ height: '300px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/600x300?text=Image+Not+Found'
                            }}
                          />
                          <CCarouselCaption className="d-none d-md-block">
                            <p className="text-white bg-dark bg-opacity-50 rounded px-2 py-1">
                              Image {index + 1} of {selectedProperty.images.length}
                            </p>
                          </CCarouselCaption>
                        </CCarouselItem>
                      ))}
                    </CCarousel>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CIcon icon={cilHome} size="3xl" className="text-medium-emphasis mb-2" />
                    <p className="text-medium-emphasis">No images available</p>
                  </div>
                )}
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setShowDetailModal(false)
              setSelectedProperty(null)
              setActiveIndex(0)
            }}
          >
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Delete Confirmation Modal */}
      <CModal
        visible={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletingProperty(null)
        }}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Delete Property</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the property at &ldquo;{deletingProperty?.address}&rdquo;?
          This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setShowDeleteModal(false)
              setDeletingProperty(null)
            }}
          >
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDeleteConfirm}>
            Delete Property
          </CButton>
        </CModalFooter>
      </CModal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </CRow>
  )
}

export default RealEstateList
