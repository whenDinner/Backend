export interface UserToken {
  uuid: string,
  grade: number,
  class: number,
  number: number,
  roomNumber: number,
  name: string,
  type: number,
  isExit: boolean,
  isOuting: boolean,
  createdAt: Date
}