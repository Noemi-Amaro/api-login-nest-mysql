import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { loginDto } from './dto/login.dto'; 
import { Usuario } from './inteface/usuario.interface';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';    

@Injectable()
export class AuthService {
    constructor(private databaseService:DatabaseService, private jwtService: JwtService){}
    
    async login(loginDto:loginDto) {
        const {email, senha} = loginDto;
        const resultado = await this.databaseService.query(
            `SELECT id, nome, email, senha FROM usuario WHERE email = ?`, [email]);

            const usuarios = resultado as Usuario[];
            const usuario = usuarios[0]; //essa posição sera usada se encontrar o email
            if (!usuario) {
                throw new UnauthorizedException('Email ou senha inválidos');
            }
            const senhaValida = await compare(senha, usuario.senha);

            if(!senhaValida) {
                throw new UnauthorizedException('Email ou senha inválidos');
            }

            const payload = {
                id: usuario.id,
                email: usuario.email
            }

            const token = this.jwtService.sign(payload);

            return {
                mensagem: 'Login realizado com sucesso',
                access_token: token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email,
                },
            };
        }

        async loginComSession(loginDto:loginDto){
            const {email, senha} = loginDto;
            const resultado = await this.databaseService.query(
                `
                SELECT id, nome, email, senha
                FROM usuario
                WHERE email = ?
                `,
                [email]
            );

            const usuarios = resultado as Usuario[];
            const usuario = usuarios[0];

            if(!usuario) {
                throw new UnauthorizedException('Email ou senha inválidos!')
            }

            return {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            };
        }
}
