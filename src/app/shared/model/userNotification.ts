export class UserNotification {
  constructor(
    public id: number,
    public userId: number,
    public title: string,
    public message: string,
    public sendAt: Date
  ) {}
}
