export class Profile {
  constructor(
    public id: number,
    public userId: number,
    public firstName: string,
    public lastName: string,
    public city: string,
    public country: string,
    public birthDate: Date,
    public description: string,
    public photo: string,
    public occupation: string | null,
    public experience: number,
  ) {}
}
