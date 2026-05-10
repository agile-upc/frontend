export class Crop {
  constructor(
    public id: number,
    public farmerId: number,
    public name: string,
    public temperature: number,
    public humidity: number,
    public tankMaxVolume: number,
    public tankHeight: number,
    public tankCurrentVolume: number,
    public temperatureMaxThreshold: number,
    public humidityMinThreshold: number,
  ){}

  public get isIrrigating(): boolean {
    return (this.humidity <= this.humidityMinThreshold || this.temperature >= this.temperatureMaxThreshold)
      && (this.tankCurrentVolume / this.tankMaxVolume * 100 > 5);
  }

  static fromDto(dto: any): Crop {
    const id = dto.id ?? 0;
    const farmerId = dto.farmerId ?? 0;
    const name = dto.name ?? '';
    const temperature = dto.temperature ?? 0;
    const humidity = dto.humidity ?? 0;
    const tankMaxVolume = dto.tankMaxVolume ?? 0;
    const tankHeight = dto.tankHeight ?? 0;
    const tankCurrentVolume = dto.tankCurrentVolume ?? 0;
    const temperatureMaxThreshold = dto.temperatureMaxThreshold ?? 0;
    const humidityMinThreshold = dto.humidityMinThreshold ?? 0;
    return new Crop(id, farmerId, name, temperature, humidity, tankMaxVolume, tankHeight, tankCurrentVolume, temperatureMaxThreshold, humidityMinThreshold);
  }
}
