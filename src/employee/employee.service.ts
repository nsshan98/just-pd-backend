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
    const employee = this.employeeRepository.create({
      ...dto,
      user,
    });

    const saved = await this.employeeRepository.save(employee);
    return {
      id: saved.id,
      name: saved.name,
      email: saved.email,
      show_email: saved.show_email,
      official_phone: saved.official_phone,
      show_official_phone: saved.show_official_phone,
      personal_phone: saved.personal_phone,
      show_personal_phone: saved.show_personal_phone,
      designation: saved.designation,
      department: saved.department,
      sorting_order: saved.sorting_order,
      is_published: saved.is_published,
      image: saved.image ?? null,
    };
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
        'id',
        'name',
        'email',
        'show_email',
        'official_phone',
        'show_official_phone',
        'personal_phone',
        'show_personal_phone',
        'designation',
        'department',
        'sorting_order',
        'is_published',
        'image',
      ],
      order: { created_at: 'DESC' },
    });

    const result = employees.map((emp) => {
      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        show_email: emp.show_email,
        official_phone: emp.official_phone,
        show_official_phone: emp.show_official_phone,
        personal_phone: emp.personal_phone,
        show_personal_phone: emp.show_personal_phone,
        designation: emp.designation,
        department: emp.department,
        sorting_order: emp.sorting_order,
        is_published: emp.is_published,
        image: emp.image,
      };
    });

    return result;
  }

  async showAllEmployees() {
    const employees = await this.employeeRepository.find({
      select: [
        'id',
        'name',
        'email',
        'show_email',
        'official_phone',
        'show_official_phone',
        'personal_phone',
        'show_personal_phone',
        'designation',
        'department',
        'sorting_order',
        'is_published',
        'image',
      ],
      where: { is_published: true },
    });

    const result = employees.map((emp) => {
      return {
        id: emp.id,
        name: emp.name,
        email: emp.show_email ? emp.email : null,
        official_phone: emp.show_official_phone ? emp.official_phone : null,
        personal_phone: emp.show_personal_phone ? emp.personal_phone : null,
        designation: emp.designation,
        department: emp.department,
        sorting_order: emp.sorting_order,
        is_published: emp.is_published,
        image: emp.image,
      };
    });

    return result;
  }

  async getAllDepartments(): Promise<string[]> {
    const result = await this.employeeRepository
      .createQueryBuilder('employee')
      .select('DISTINCT employee.department', 'department')
      .orderBy('employee.department', 'ASC')
      .getRawMany();

    // result = [{ department: "HR" }, { department: "IT" }, ...]
    return result.map((row) => row.department);
  }

  async getEmployeesByDepartment(department: string) {
    return this.employeeRepository
      .find({
        select: [
          'id',
          'name',
          'email',
          'show_email',
          'official_phone',
          'show_official_phone',
          'personal_phone',
          'show_personal_phone',
          'designation',
          'department',
          'sorting_order',
          'is_published',
          'image',
        ],
        where: { department, is_published: true },
        order: { sorting_order: 'ASC' },
      })
      .then((employees) =>
        employees.map((emp) => ({
          id: emp.id,
          name: emp.name,
          email: emp.show_email ? emp.email : null,
          official_phone: emp.show_official_phone ? emp.official_phone : null,
          personal_phone: emp.show_personal_phone ? emp.personal_phone : null,
          designation: emp.designation,
          department: emp.department,
          sorting_order: emp.sorting_order,
          is_published: emp.is_published,
          image: emp.image,
        })),
      );
  }
}
