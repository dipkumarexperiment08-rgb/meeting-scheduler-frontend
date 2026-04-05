import api from './api'

export const createMeeting = (data) => api.post('/meetings', data)
export const getMeetings = () => api.get('/meetings')
export const getMeeting = (id) => api.get(`/meetings/${id}`)
export const updateMeeting = (id, data) => api.put(`/meetings/${id}`, data)
export const deleteMeeting = (id) => api.delete(`/meetings/${id}`)
export const updateRSVP = (id, status) => api.put(`/meetings/${id}/rsvp`, { status })