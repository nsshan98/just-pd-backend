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
    const employees = await this.employeeRepository.find({
      select: [
        'name',
        'email',
        'show_email',
        'phone',
        'show_phone',
        'designation',
        'department',
        'image',
      ],
    });

    const result = employees.map((emp) => {
      return {
        name: emp.name,
        email: emp.show_email ? emp.email : null,
        phone: emp.show_phone ? emp.phone : null,
        designation: emp.designation,
        department: emp.department,
        image: emp.image,
      };
    });

    return result;
  }

  async getAllDepartments(): Promise<string[]> {
    const result = await this.employeeRepository
      .createQueryBuilder('employee')
      .select('DISTINCT employee.department', 'department')
      .getRawMany();

    // result = [{ department: "HR" }, { department: "IT" }, ...]
    return result.map((row) => row.department);
  }
}
