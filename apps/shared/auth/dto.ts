export type RegisterRequestDto = {
  email: string
  password: string
}

export type LoginRequestDto = {
  email: string
  password: string
}

export type RefreshRequestDto = {
  refreshToken: string
}

export type LogoutRequestDto = {
  refreshToken?: string
}

export type UserDto = {
  id: number
  email: string
}

export type AuthTokensDto = {
  accessToken: string
  refreshToken: string
}

export type RegisterResponseDto = {
  ok: true
  user: UserDto
  accessToken: string
  refreshToken: string
}

export type LoginResponseDto = {
  ok: true
  user: UserDto
  accessToken: string
  refreshToken: string
}

export type RefreshResponseDto = {
  ok: true
  accessToken: string
  refreshToken: string
}

export type MeResponseDto = {
  ok: true
  user: UserDto
}

export type ErrorResponseDto = {
  ok: false
  message: string
}