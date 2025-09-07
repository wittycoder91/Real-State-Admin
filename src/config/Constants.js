export const API_URLS = {
  LOGIN: `${process.env.REACT_APP_API_URL}/auth/admin/login`,

  // Real Estate
  GETREALESTATE: `${process.env.REACT_APP_API_URL}/real-estate/all`,
  GETREALESTATEBYID: `${process.env.REACT_APP_API_URL}/real-estate`,
  UPDATERALESTATESTATUS: `${process.env.REACT_APP_API_URL}/real-estate`,
  DELETEREALESTATE: `${process.env.REACT_APP_API_URL}/real-estate`,

  // Contact Inquiries
  GETCONTACTINQUIRIES: `${process.env.REACT_APP_API_URL}/real-estate/contacts`,
  GETCONTACTINQUIRYBYID: `${process.env.REACT_APP_API_URL}/real-estate/contacts`,
  UPDATECONTACTINQUIRYSTATUS: `${process.env.REACT_APP_API_URL}/real-estate/contacts`,
  DELETECONTACTINQUIRY: `${process.env.REACT_APP_API_URL}/real-estate/contacts`,
}
