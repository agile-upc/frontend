export interface CropDto {
  farmerId: number;
  name: string;
  temperature: number;
  humidity: number;
  tankMaxVolume: number;
  tankHeight: number;
  tankCurrentVolume: number;
  temperatureMaxThreshold: number;
  humidityMinThreshold: number;
}
