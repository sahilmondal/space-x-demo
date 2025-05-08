import axios from "axios"

const BASE_URL = "https://api.spacexdata.com/v4"

export interface Launch {
  id: string
  name: string
  date_utc: string
  date_local: string
  success: boolean | null
  details: string | null
  flight_number: number
  upcoming: boolean
  rocket: string
  crew: string[]
  payloads: string[]
  launchpad: string
  links: {
    patch: {
      small: string | null
      large: string | null
    }
    webcast: string | null
    article: string | null
    wikipedia: string | null
    flickr: {
      small: string[]
      original: string[]
    }
  }
}

export interface Rocket {
  id: string
  name: string
  type: string
  active: boolean
  stages: number
  boosters: number
  cost_per_launch: number
  success_rate_pct: number
  first_flight: string
  country: string
  company: string
  height: {
    meters: number
    feet: number
  }
  diameter: {
    meters: number
    feet: number
  }
  mass: {
    kg: number
    lb: number
  }
  description: string
  wikipedia: string
  flickr_images: string[]
}

export interface Launchpad {
  id: string
  name: string
  full_name: string
  locality: string
  region: string
  latitude: number
  longitude: number
  launch_attempts: number
  launch_successes: number
  details: string
  status: string
  images: {
    large: string[]
  }
}

export interface Crew {
  id: string
  name: string
  agency: string
  image: string
  wikipedia: string
  launches: string[]
  status: string
}

export interface Payload {
  id: string
  name: string
  type: string
  mass_kg: number | null
  mass_lbs: number | null
  orbit: string | null
  customers: string[]
}

export const fetchLaunches = async () => {
  const response = await axios.get<Launch[]>(`${BASE_URL}/launches`)
  return response.data
}

export const fetchLaunch = async (id: string) => {
  const response = await axios.get<Launch>(`${BASE_URL}/launches/${id}`)
  return response.data
}

export const fetchRocket = async (id: string) => {
  const response = await axios.get<Rocket>(`${BASE_URL}/rockets/${id}`)
  return response.data
}

export const fetchLaunchpad = async (id: string) => {
  const response = await axios.get<Launchpad>(`${BASE_URL}/launchpads/${id}`)
  return response.data
}

export const fetchCrew = async (id: string) => {
  const response = await axios.get<Crew>(`${BASE_URL}/crew/${id}`)
  return response.data
}

export const fetchPayload = async (id: string) => {
  const response = await axios.get<Payload>(`${BASE_URL}/payloads/${id}`)
  return response.data
}

export const fetchMultipleCrewMembers = async (ids: string[]) => {
  if (!ids.length) return []
  const promises = ids.map((id) => fetchCrew(id))
  return Promise.all(promises)
}

export const fetchMultiplePayloads = async (ids: string[]) => {
  if (!ids.length) return []
  const promises = ids.map((id) => fetchPayload(id))
  return Promise.all(promises)
}
