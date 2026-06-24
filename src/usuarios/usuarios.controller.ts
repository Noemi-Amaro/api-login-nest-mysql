import { Controller, Body, Post } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
    constructor(private usuariosService:UsuariosService){}
    @Post()
    criar(@Body() createUsuarioDto:CreateUsuarioDto) {
        return this.usuariosService.criar(createUsuarioDto);
    }
}
