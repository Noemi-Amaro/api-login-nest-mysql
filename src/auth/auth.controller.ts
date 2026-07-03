import { Controller, Body, Post, Get, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('login')
    login(@Body() loginDto:loginDto) {
        return this.authService.login(loginDto);
    }

    @Get('publica')
    rotaPublica(){
        return {
            mensagem: 'Esta é uma rota pública!'
        }
    }

    @UseGuards(AuthGuard)
    @Get('privada')
    rotaPrivada(@Req() req){
        return {
            mensagem: 'Token válido! Bem-vindo(a)',
            usuario: req.user
        }
    }

    @Post('session-login')
    async sessionLogin(@Body() loginDto: loginDto, @Req() req){
        const usuario = await this.authService.loginComSession(loginDto);
        req.session.usuario = usuario;
        return {
            mensagem: 'Login com session realizado com sucesso',
            usuario
        };
    }

    @Get('session-area')
    sessionArea(@Req() req){
        if(!req.session.usuario) {
            throw new UnauthorizedException('Sessão não encontrada. Faça login');
        }
        return {
            mensagem: 'Você acessou uma área protegida por session',
            usuario: req.session.usuario
        };
    }

    @Post('session-logout')
    sessionLogout(@Req() req){
        req.session.destroy();
        return {
            mensagem: 'Logout realizado com sucesso'
        };
    }
}
