type UserType = 0 | 1 | 2

export interface oidcToken {
  iss: string,
  sub: string,
  aud: string,
  nonce: any,
  data: {
    id: number,
    login: string,
    nickname: string,
    createdAt: Date,
    type: UserType,
    classInfo: {
      grade: number,
      class: number,
      number: number
    },
    dormitory?: {
      room: string
    },
    gender: 'M' | 'F'
    phone: string,
    fullname: string
  },
  iat: number,
  exp: number
}

export interface oidcTokenData {
  id: number,
  login: string,
  nickname: string,
  createdAt: Date,
  type: UserType,
  classInfo: {
    grade: number,
    class: number,
    number: number
  },
  dormitory?: {
    room: string
  },
  gender: 'M' | 'F'
  phone: string,
  fullname: string
}

export interface UserToken {
  login: string,
  nickname: string,
  student_id: string,
  grade: number,
  class: number,
  number: number,
  roomNumber: number,
  fullname: string,
  gender: 'M' | 'F',
  type: UserType,
}