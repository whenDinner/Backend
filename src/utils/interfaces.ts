type UserType = 0 | 1 | 2

export interface oidcToken {
  iss: string,
  sub: string,
  aud: string,
  nonce: string,
  data: {
    id: number,
    login: string,
    nickname?: string | null,
    createdAt: Date,
    type: UserType,
    classInfo: {
      grade?: number | null,
      class?: number | null,
      number?: number | null
    },
    dormitory: {
      room?: string | null
    },
    gender?: 'M' | 'F' | null
    phone?: string | null,
    fullname: string
  },
  iat: number,
  exp: number
}

export interface oidcTokenData {
  id: number,
  login: string,
  nickname?: string | null,
  createdAt: Date,
  type: UserType,
  classInfo: {
    grade?: number | null,
    class?: number | null,
    number?: number | null
  },
  dormitory?: {
    room?: string | null
  } | null,
  gender?: 'M' | 'F' | null
  phone?: string | null,
  fullname: string
}

export interface UserToken {
  login: string,
  nickname?: string | null,
  student_id?: string | null,
  grade?: number | null,
  class?: number | null,
  number?: number | null,
  roomNumber?: number | null,
  fullname: string,
  gender: 'M' | 'F' | null,
  type: UserType,
}