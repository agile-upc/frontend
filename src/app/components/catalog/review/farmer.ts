export class Farmer {
  constructor(
    public farmerId: number,
    public userId: number,
  ) {}

  static fromDto(dto: any): Farmer {
    return new Farmer(
      dto.id ?? 0,
      dto.userId ?? 0,
    );
  }
}
