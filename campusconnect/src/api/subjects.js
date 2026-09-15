import api from './axios'

export const getRegulations = async () => {
  const res = await api.get('/public/regulations')
  return res.data
}

export const getSubjectsByRegulation = async (regCode) => {
  const res = await api.get(`/public/subjects/${regCode}`)
  return res.data
}

export const searchSubjects = async (query) => {
  const res = await api.get(`/public/subjects/search?query=${query}`)
  return res.data
}

export const getUnitsBySubject = async (subjectId) => {
  const res = await api.get(`/public/units/${subjectId}`)
  return res.data
}

export const getResourcesByUnit = async (unitId) => {
  const res = await api.get(`/public/resources/${unitId}`)
  return res.data
}

export const suggestSubject = async (suggestionData) => {
  const res = await api.post('/public/subjects/suggest', suggestionData)
  return res.data
}