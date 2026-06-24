import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';        
import { DatabaseService } from 'src/database/database.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsuariosService {
    constructor(private databaseService: DatabaseService) {}

    async criar(createUsuarioDto:CreateUsuarioDto) {
        const {nome, email, senha} = createUsuarioDto;
        const senhaHash = await hash(senha,10);
        const sql = 
        'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';

        await this.databaseService.query(sql, [
            nome,
            email,
            senhaHash, //senha alterada para senhaHash
        ]);
        return{
            mensagem: "Usuário cadastrado com sucessso!"
        };
    }
}
