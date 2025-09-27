import { ClassConstructor, plainToInstance } from 'class-transformer';

export function fillResponseDto<T, D>(dto: ClassConstructor<T>, data: D[]): T[];
export function fillResponseDto<T, D>(dto: ClassConstructor<T>, data: D): T;
export function fillResponseDto<T, D>(
  dto: ClassConstructor<T>,
  data: D | D[],
): T | T[] {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
  });
}