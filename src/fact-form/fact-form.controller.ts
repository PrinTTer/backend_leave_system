import { Controller, Post, Body } from '@nestjs/common';
import { FactFormService } from './fact-form.service';
import { CreateFactFormDto } from './dto/create-fact-form.dto';

@Controller('fact-form')
export class FactFormController {
  constructor(private readonly service: FactFormService) {}

  @Post()
  create(@Body() dto: CreateFactFormDto) {
    return this.service.createLeave(dto);
  }
}
