export class Advisor {
  constructor(
    // De tabla "profile"
    public advisorId: number,
    public userId: number,
    public firstName: string,
    public lastName: string,
    public city: string,
    public country: string,
    public birthDate: Date,
    public description: string,
    public photo: string,
    public occupation: string,
    public experience: number,
    // De tabla "advisor"
    public rating: number,
  ) {}
}
