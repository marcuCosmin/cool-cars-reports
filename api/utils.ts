import { type Answer, type OdoReading } from "@/redux/answersSlice"

import { executeApiRequest } from "./config"

export type PostCheckAnswersPayload = {
  interior: Answer[]
  exterior: Answer[]
  odoReading: OdoReading
  carId: string
}

export const postCheckAnswers = (payload: PostCheckAnswersPayload) =>
  executeApiRequest({
    path: "/checks",
    method: "POST",
    payload,
  })

type PostIncidentPayload = {
  description: string
  carId: string
}

export const postIncident = (payload: PostIncidentPayload) =>
  executeApiRequest({
    path: "/incidents",
    method: "POST",
    payload,
  })
