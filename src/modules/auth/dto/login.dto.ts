import { OmitType } from '@nestjs/swagger';

import { RegisterUserDto } from './register.dto';

export class LoginDTO extends OmitType(RegisterUserDto, ['name']) {}