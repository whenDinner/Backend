import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "accountEntity" })
export default class AccountEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ name: 'login', type: 'varchar', length: 36, nullable: false, unique: true })
  login: string;

  @Column({ name: 'nickname', type: 'varchar', length: 36, nullable: true })
  nickname?: string | null;

  @Column({ name: 'student_id', type: 'varchar', length: 6, nullable: false })
  student_id?: string | null;

  @Column({ name: 'grade', type: 'int', nullable: true })
  grade?: number | null;

  @Column({ name: 'class', type: 'int', nullable: true })
  class?: number | null;

  @Column({ name: 'number', type: 'int', nullable: true })
  number?: number | null;

  @Column({ name: 'roomNumber', type: 'varchar', length: 4, nullable: true })
  roomNumber?: string | null;

  @Column({ name: 'fullname', type: 'varchar', length: 6 })
  fullname: string;

  @Column({ name: 'gender', type: "varchar", length: 1, nullable: true })
  gender?: "M" | "F" | null;

  @Column({ name: 'type', type: 'int', nullable: false })
  type: 0 | 1 | 2;

  @Column({ name: 'isReturn', type: 'bool', nullable: true })
  isReturn?: boolean | null ;

  @Column({ name: 'isOuting', type: 'bool', nullable: true })
  isOuting?: boolean | null;
  
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}