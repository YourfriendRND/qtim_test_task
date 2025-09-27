import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtStrategies } from '../enums';

export const JWTGuard = (guard: JwtStrategies) =>
  applyDecorators(UseGuards(AuthGuard(guard)));