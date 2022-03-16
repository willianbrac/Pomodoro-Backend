import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'Criar novos use cases', isDone: 0 }),
  new TodoEntity({ id: '2', task: 'Compilar o projeto', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'Documentar no Readme', isDone: 0 }),
];

const newTodoEntity = new TodoEntity({
  task: 'Codar um CRUD',
  isDone: 0,
});
const updatedTodoEntity = new TodoEntity({
  task: 'Criar novos use cases',
  isDone: 1,
});

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoEntityList),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedTodoEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('should return a todo list entity successfully', async () => {
      const result = await todoController.index();
      expect(result).toEqual(todoEntityList);
      expect(typeof result).toEqual('object');
      expect(todoService.findAll).toHaveBeenCalledTimes(1);
    });
    it('should throw an exception', () => {
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());
      expect(todoController.index()).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a new todo item successfully', async () => {
      const body: CreateTodoDto = {
        task: 'Codar um CRUD',
        isDone: 0,
      };
      const result = await todoController.create(body);
      expect(result).toEqual(newTodoEntity);
      expect(todoService.create).toHaveBeenCalledTimes(1);
      expect(todoService.create).toHaveBeenCalledWith(body);
    });
    it('should throw an exception', () => {
      const body: CreateTodoDto = {
        task: 'Codar um CRUD',
        isDone: 0,
      };
      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());
      expect(todoController.create(body)).rejects.toThrowError();
    });
  });

  describe('show', () => {
    it('should get a todo item successfully', async () => {
      const result = await todoController.show('1');
      expect(result).toEqual(todoEntityList[0]);
      expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);
      expect(todoService.findOneOrFail).toHaveBeenCalledWith('1');
    });
    it('should throw an exception', () => {
      jest
        .spyOn(todoService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      expect(todoController.show('1')).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should update a todo item successfully', async () => {
      const body: UpdateTodoDto = {
        task: 'Criar novos use cases',
        isDone: 1,
      };
      const result = await todoController.update('1', body);
      expect(result).toEqual(updatedTodoEntity);
      expect(todoService.update).toHaveBeenCalledTimes(1);
      expect(todoService.update).toHaveBeenCalledWith('1', body);
    });
    it('should throw an exception', () => {
      const body: UpdateTodoDto = {
        task: 'Criar novos use cases',
        isDone: 1,
      };
      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());
      expect(todoController.update('1', body)).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should remove a todo item successfully', async () => {
      const result = await todoController.destroy('1');
      expect(result).toBeUndefined();
    });
    it('should throw an exception', () => {
      jest.spyOn(todoService, 'deleteById').mockRejectedValueOnce(new Error());
      expect(todoController.destroy('1')).rejects.toThrowError();
    });
  });
});
