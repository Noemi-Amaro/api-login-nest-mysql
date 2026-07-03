// CanActivate --> Interface que define se uma requisição pode ou não continuar
// ExecutionContext --> Permite acessar informações da requisição, reposta e outros dados da execução
// Injectable --> Indica que a classe pode ser injetada pelo sitema de dependências
// UnauthorizedException --> Exceção utilizada para retornar o erro 401 (não autorizado)

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"; // valida o JWT
import { Request } from "express"; // Tipagem de requisição HTTP
import { Observable, takeWhile} from "rxjs";

  @Injectable()
  export class AuthGuard implements CanActivate{
    //Recebe o JwtService por injeção de dependência
    constructor(private jwtService: JwtService){}

    // Método executado automaticamente sempre que uma rota protegida recebe uma requisição
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        //Obtém a requisição HTTP atual
        const request = context.switchToHttp().getRequest<Request>();

        //Tenta extrair o token enviado no Header Authorization.
        const token = this.extrairToken(request);

        // Caso não tenha token, bloqueia imediatamente o acesso
        if(!token){
            throw new UnauthorizedException('O Token não foi informado');
        }

        try {
            // Valida o token usando a mesma chave
            const payload = await this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });

            // Se o token for válido, armazena as informações do usuário dentro da requisição
            // Essas informações poderão ser utilizadas posteriormente pelo Controller

            request [ 'user' ] = payload;
        } catch {
            throw new UnauthorizedException('Token inválido');
        }
        return true; // Se chegou até aqui, a requisição pode continuar  
    }

    // Método responsável por extrair apenas o token enviado no cabeçalho Authorization
    private extrairToken(request: Request): string | undefined {
        // Obtém o valor do Header Authorization
        const authHeader = request.headers.authorization;
        if (!authHeader){
            return undefined;
        }

        // Divide o conteúdo em 2 partes:
        // Bearer e Token 
        const [tipo, token] = authHeader.split(' ');
        // Verifica se o tipo informado é "Bearer", se for, retorna apenas o token. Se não, retorna undefined

        return tipo === 'Bearer' ? token : undefined;
    }
  }
