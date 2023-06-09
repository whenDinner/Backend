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
  gender: 'M' | 'F' | null,
  type: UserType,
}

export type CommentType = 'N' | 'R'

export type PostType = 
  '공지' | '분실물' | '게시글' | '건의사항' | '익명 게시판'

export type DotwType = 
  '금' | '토' | '일'

export type outgoType = 
  '오전외출' | '오후외출' | '외출' | '외박'