import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "accountEntity" })
export default class AccountEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ name: 'login', type: 'varchar', length: 36, nullable: false, unique: true })
  login: string;

  @Column({ name: 'nickname', type: 'varchar', length: 36, nullable: true })
  nickname?: string | null;

  @Column({ name: 'student_id', type: 'varchar', length: 6, nullable: true })
  student_id?: string | null;

  @Column({ name: 'grade', type: 'int', nullable: true })
  grade?: number | null;

  @Column({ name: 'class', type: 'int', nullable: true })
  class?: number | null;

  @Column({ name: 'number', type: 'int', nullable: true })
  number?: number | null;

  @Column({ name: 'roomNumber', type: 'int', nullable: true })
  roomNumber?: number | null;

  @Column({ name: 'fullname', type: 'varchar', length: 6, nullable: true })
  fullname: string;

  @Column({ name: 'gender', type: "varchar", length: 1, nullable: true })
  gender?: "M" | "F" | null;

  @Column({ name: 'type', type: 'int', nullable: false })
  type: 0 | 1 | 2;
  
  // 선택 안함 | 잔류 | 귀가
  @Column({ name: 'rh', type: 'tinyint', nullable: false, default: false })
  rh: 0 | 1 | 2;

  // 선택 안함 | 잔류 | 외출 | 외박 | 귀가
  @Column({ name: 'gs', type: 'tinyint', nullable: true, default: 0 })
  gs: 0 | 1 | 2 | 3 | 4

  @Column({ name: 'isOuting', type: 'boolean', nullable: false, default: false })
  isOuting: boolean;
  
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}