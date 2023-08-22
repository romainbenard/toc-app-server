declare namespace Express {
  export interface Request {
    currentUser?: { email: string; name: string; id: string }
  }
}
