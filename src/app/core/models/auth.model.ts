// Payload para el inicio de sesión
export interface SignInPayload {
    email: string,
    password: string
}

// Payload para el registro de usuario
export interface SignUpPayload {
    email: string,
    password: string,
    username: string,
    birthDate: string,
    gender: string,
    group: string,
    user: string
}

// Representación básica de un usuario autenticado
export interface User {
    id: string,
    username: string,
    email: string
}
