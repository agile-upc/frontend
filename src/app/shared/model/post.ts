export class Post {
  constructor(
    public id: number | null,
    public advisorId: number | null,
    public title: string,
    public description: string,
    public image: string,
  ) {}
}
