import { SetMetadata } from '@nestjs/common';

export const FreeAuth = () => SetMetadata('isFreeAuth', true);
