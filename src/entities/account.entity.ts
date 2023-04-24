import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "accountEntity" })
export default class AccountEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ name: 'grade', type: 'int' })
  grade: number;

  @Column({ name: 'class', type: 'int' })
  class: number;

  @Column({ name: 'number', type: 'int' })
  number: number;

  @Column({ name: 'roomNumber', type: 'int' })
  roomNumber: number;

  @Column({ name: 'name', type: 'varchar', length: 6 })
  name: string;

  @Column({ name: 'type', type: 'int', nullable: false })
  type: number;

  @Column({ name: 'isExit', type: 'bool' })
  isExit: boolean;

  @Column({ name: 'isOuting', type: 'bool' })
  isOuting: boolean;
  
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}