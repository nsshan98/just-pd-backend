import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateEmployeeDto } from './dto/createEmployee.dto';
import { UpdateEmployeeDto } from './dto/updateEmployee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findOneWithId(id: string) {
    return await this.employeeRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
  async createEmployee(dto: CreateEmployeeDto, user: User) {
    const employee = await this.employeeRepository.create({
      ...dto,
      user,
    });

    return await this.employeeRepository.save(employee);
  }

  async updateEmployee(id: string, dto: UpdateEmployeeDto) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      // relations: ['user'],
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const { ...rest } = dto;

    Object.assign(employee, rest);

    return await this.employeeRepository.save(employee);
  }

  async deleteEmployee(id: string) {
    return await this.employeeRepository.delete({ id });
  }

  async getAllEmployees() {
    return await this.employeeRepository.find();
  }
}
