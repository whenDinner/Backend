import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "accountEntity" })
export default class AccountEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ name: 'login', type: 'varchar', length: 36, nullable: false, unique: true })
  login: string;

  @Column({ name: 'nickname', type: 'varchar', length: 36, nullable: false })
  nickname: string;

  @Column({ name: 'student_id', type: 'varchar', length: 6, nullable: false })
  student_id: string;

  @Column({ name: 'grade', type: 'int' })
  grade: number;

  @Column({ name: 'class', type: 'int' })
  class: number;

  @Column({ name: 'number', type: 'int' })
  number: number;

  @Column({ name: 'roomNumber', type: 'varchar', length: 4 })
  roomNumber: string;

  @Column({ name: 'fullname', type: 'varchar', length: 6 })
  fullname: string;

  @Column({ name: 'gender', type: "varchar", length: 1, nullable: false })
  gender: "M" | "F";

  @Column({ name: 'type', type: 'int', nullable: false })
  type: 0 | 1 | 2;

  @Column({ name: 'isExit', type: 'bool' })
  isExit: boolean;

  @Column({ name: 'isOuting', type: 'bool' })
  isOuting: boolean;
  
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}