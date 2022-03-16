import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { BadRequestSwagger } from './helpers/swagger/bad-request.swagger';
import { NotFoundSwagger } from './helpers/swagger/not-found.swagger';
import { CreateTodoSwagger } from './swagger/create-todo.swagger';
import { IndexTodoSwagger } from './swagger/index-todo.swagger';
import { ShowTodoSwagger } from './swagger/show-todo.swagger';
import { UpdateTodoSwagger } from './swagger/update-todo.swagger';
import { TodoService } from './todo.service';

@Controller('api/todo')
@ApiTags('Todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas' })
  @ApiResponse({
    status: 200,
    description: 'Tarefas retornadas com sucesso',
    type: IndexTodoSwagger,
    isArray: true,
  })
  async index() {
    return await this.todoService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiResponse({
    status: 201,
    description: 'Nova tarefa criada com sucesso',
    type: CreateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros invávlidos',
    type: BadRequestSwagger,
  })
  async create(@Body() body: CreateTodoDto) {
    return await this.todoService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Exibir os dados de uma tarefa' })
  @ApiResponse({
    status: 201,
    description: 'Dados da tarefa',
    type: ShowTodoSwagger,
  })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada' })
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar os dados de uma tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada com sucesso',
    type: UpdateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
    type: BadRequestSwagger,
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    type: NotFoundSwagger,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover uma tarefa' })
  @ApiResponse({ status: 204, description: 'Tarefa deletada' })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
    type: NotFoundSwagger,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.deleteById(id);
  }
}
