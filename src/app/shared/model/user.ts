export class User {
  constructor(
    public id: number | null,
    public username: string,
    public password: string,
    public roles: string[] | null,
    public advisorId?: number | null
  ) {}
}
