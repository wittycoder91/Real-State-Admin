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
import { cilLayers, cilTrash, cilCheck, cilX, cilUser, cilHome } from '@coreui/icons'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import api from 'src/services'
import { API_URLS } from 'src/config/Constants'
import { showSuccessMsg, showWarningMsg, showErrorMsg } from 'src/config/common'

const ContactInquiriesList = () => {
  const [contactInquiries, setContactInquiries] = useState([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [deletingInquiry, setDeletingInquiry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: 'success' })
  const [activeIndex, setActiveIndex] = useState(0)

  // Load contact inquiries from API on component mount
  useEffect(() => {
    getContactInquiries()
  }, [])

  const getContactInquiries = async () => {
    try {
      setLoading(true)
      const response = await api.get(API_URLS.GETCONTACTINQUIRIES)

      if (response.data.success) {
        setContactInquiries(response.data.data || [])
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

  const handleViewDetails = async (inquiry) => {
    try {
      setLoading(true)
      const response = await api.get(`${API_URLS.GETCONTACTINQUIRYBYID}/${inquiry._id}`)

      if (response.data.success) {
        setSelectedInquiry(response.data.data)
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

  const handleDeleteClick = (inquiry) => {
    setDeletingInquiry(inquiry)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await api.delete(`${API_URLS.DELETECONTACTINQUIRY}/${deletingInquiry._id}`)

      if (response.data.success) {
        showSuccessMsg(response.data.message)
        setShowDeleteModal(false)
        setDeletingInquiry(null)
        getContactInquiries() // Refresh the list
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

  const handleToggleStatus = async (inquiryId) => {
    try {
      const inquiry = contactInquiries.find((i) => i._id === inquiryId)
      const newStatus = !inquiry.status

      const response = await api.post(`${API_URLS.UPDATECONTACTINQUIRYSTATUS}/${inquiryId}`, {
        status: newStatus,
      })

      if (response.data.success) {
        showSuccessMsg(`Contact inquiry ${newStatus ? 'activated' : 'deactivated'} successfully!`)
        getContactInquiries() // Refresh the list
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
                <h4 className="mb-0">Contact List Management</h4>
                <p className="text-medium-emphasis">Manage contact information from users</p>
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
                <p className="text-medium-emphasis mt-2">Loading data...</p>
              </div>
            ) : contactInquiries.length === 0 ? (
              <div className="text-center py-5">
                <CIcon icon={cilUser} size="3xl" className="text-medium-emphasis mb-3" />
                <p className="text-medium-emphasis">No contact list found.</p>
              </div>
            ) : (
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Student</CTableHeaderCell>
                    <CTableHeaderCell>University</CTableHeaderCell>
                    <CTableHeaderCell>Property</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Bedrooms</CTableHeaderCell>
                    <CTableHeaderCell>Bathrooms</CTableHeaderCell>
                    <CTableHeaderCell>Price</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {contactInquiries.map((inquiry) => (
                    <CTableRow key={inquiry._id}>
                      <CTableDataCell>
                        <div>
                          <strong>{inquiry.userName}</strong>
                          <br />
                          <small className="text-medium-emphasis">{inquiry.email}</small>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="info">{inquiry.university}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>
                          <strong>{inquiry.realEstateDetails.address}</strong>
                          <br />
                          <small className="text-medium-emphasis">
                            <CIcon icon={cilHome} className="me-1" />
                            {inquiry.realEstateDetails.squareFootage} sq ft
                          </small>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="secondary" className="text-capitalize">
                          {inquiry.realEstateDetails.propertyType}
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary">{inquiry.realEstateDetails.bedrooms}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="primary">{inquiry.realEstateDetails.bathrooms}</CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <strong className="text-success">
                          {formatPrice(inquiry.realEstateDetails.price)}
                        </strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color={inquiry.status ? 'success' : 'secondary'}
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(inquiry._id)}
                          className="d-flex align-items-center gap-1"
                        >
                          <CIcon icon={inquiry.status ? cilCheck : cilX} />
                          {inquiry.status ? 'Active' : 'Inactive'}
                        </CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          <CButton
                            color="info"
                            size="sm"
                            onClick={() => handleViewDetails(inquiry)}
                            className="d-flex align-items-center gap-1"
                          >
                            <CIcon icon={cilLayers} />
                            View
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(inquiry)}
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

      {/* Contact Inquiry Detail Modal */}
      <CModal
        visible={showDetailModal}
        onClose={() => {
          setShowDetailModal(false)
          setSelectedInquiry(null)
          setActiveIndex(0)
        }}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Contact Details Information</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedInquiry && (
            <CRow>
              <CCol xs={12} md={6}>
                <h5>Student Information</h5>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Name:</strong>
                      </td>
                      <td>{selectedInquiry.userName}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Email:</strong>
                      </td>
                      <td>{selectedInquiry.email}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>University:</strong>
                      </td>
                      <td>
                        <CBadge color="info">{selectedInquiry.university}</CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Inquiry Date:</strong>
                      </td>
                      <td>{formatDate(selectedInquiry.createdAt)}</td>
                    </tr>
                  </tbody>
                </table>

                <h5 className="mt-4">Property Information</h5>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Address:</strong>
                      </td>
                      <td>{selectedInquiry.realEstateDetails.address}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Type:</strong>
                      </td>
                      <td>
                        <CBadge color="info" className="text-capitalize">
                          {selectedInquiry.realEstateDetails.propertyType}
                        </CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Bedrooms:</strong>
                      </td>
                      <td>{selectedInquiry.realEstateDetails.bedrooms}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Bathrooms:</strong>
                      </td>
                      <td>{selectedInquiry.realEstateDetails.bathrooms}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Square Footage:</strong>
                      </td>
                      <td>{selectedInquiry.realEstateDetails.squareFootage} sq ft</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Price:</strong>
                      </td>
                      <td>
                        <strong className="text-success">
                          {formatPrice(selectedInquiry.realEstateDetails.price)}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Contact Status:</strong>
                      </td>
                      <td>
                        <CBadge color={selectedInquiry.status ? 'success' : 'secondary'}>
                          {selectedInquiry.status ? 'Active' : 'Inactive'}
                        </CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Property Status:</strong>
                      </td>
                      <td>
                        <CBadge
                          color={selectedInquiry.realEstateDetails.status ? 'success' : 'secondary'}
                        >
                          {selectedInquiry.realEstateDetails.status ? 'Active' : 'Inactive'}
                        </CBadge>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Property Owner:</strong>
                      </td>
                      <td>{selectedInquiry.realEstateDetails.userEmail}</td>
                    </tr>
                  </tbody>
                </table>
              </CCol>
              <CCol xs={12} md={6}>
                <h5>Property Description</h5>
                <div className="border rounded p-3 mb-3" style={{ minHeight: '200px' }}>
                  <p>
                    {selectedInquiry.realEstateDetails.description || 'No description provided'}
                  </p>
                </div>

                <h5>Student Images</h5>
                {selectedInquiry.images && selectedInquiry.images.length > 0 ? (
                  <div className="position-relative">
                    <CCarousel
                      activeIndex={activeIndex}
                      onSelect={setActiveIndex}
                      controls={true}
                      indicators={true}
                      interval={false}
                    >
                      {selectedInquiry.images.map((image, index) => (
                        <CCarouselItem key={index}>
                          <CImage
                            src={`${process.env.REACT_APP_UPLOAD_URL}${image}`}
                            alt={`Student image ${index + 1}`}
                            className="d-block w-100 rounded"
                            style={{ height: '300px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src =
                                'https://via.placeholder.com/600x300?text=Image+Not+Found'
                            }}
                          />
                          <CCarouselCaption className="d-none d-md-block">
                            <p className="text-white bg-dark bg-opacity-50 rounded px-2 py-1">
                              Student Image {index + 1} of {selectedInquiry.images.length}
                            </p>
                          </CCarouselCaption>
                        </CCarouselItem>
                      ))}
                    </CCarousel>
                    {selectedInquiry.images.length > 1 && (
                      <div className="d-flex justify-content-center mt-2">
                        <small className="text-medium-emphasis">
                          {activeIndex + 1} of {selectedInquiry.images.length} images
                        </small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CIcon icon={cilUser} size="3xl" className="text-medium-emphasis mb-2" />
                    <p className="text-medium-emphasis">No student images available</p>
                  </div>
                )}

                <h5 className="mt-4">Property Images</h5>
                {selectedInquiry.realEstateDetails.images &&
                selectedInquiry.realEstateDetails.images.length > 0 ? (
                  <div className="position-relative">
                    <CCarousel
                      activeIndex={activeIndex}
                      onSelect={setActiveIndex}
                      controls={true}
                      indicators={true}
                      interval={false}
                    >
                      {selectedInquiry.realEstateDetails.images.map((image, index) => (
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
                              Property Image {index + 1} of{' '}
                              {selectedInquiry.realEstateDetails.images.length}
                            </p>
                          </CCarouselCaption>
                        </CCarouselItem>
                      ))}
                    </CCarousel>
                    {selectedInquiry.realEstateDetails.images.length > 1 && (
                      <div className="d-flex justify-content-center mt-2">
                        <small className="text-medium-emphasis">
                          {activeIndex + 1} of {selectedInquiry.realEstateDetails.images.length}{' '}
                          images
                        </small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <CIcon icon={cilHome} size="3xl" className="text-medium-emphasis mb-2" />
                    <p className="text-medium-emphasis">No property images available</p>
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
              setSelectedInquiry(null)
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
          setDeletingInquiry(null)
        }}
        alignment="center"
      >
        <CModalHeader>
          <CModalTitle>Delete Contact Inquiry</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete the contact inquiry from &ldquo;
          {deletingInquiry?.userName}&rdquo; for property &ldquo;
          {deletingInquiry?.realEstateDetails?.address}&rdquo;? This action cannot be undone.
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              setShowDeleteModal(false)
              setDeletingInquiry(null)
            }}
          >
            Cancel
          </CButton>
          <CButton color="danger" onClick={handleDeleteConfirm}>
            Delete Inquiry
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

export default ContactInquiriesList
