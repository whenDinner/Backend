import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'outgoEntity' })
export default class OutgoEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ name: "student_id", type: "varchar", length: 6, nullable: false })
  student_id: string;

  @Column({ name: "student_name", type: "varchar", length: 6, nullable: false })
  student_name: string;

  @Column({ name: "type", type: "int", nullable: false })
  type: number;

  @CreateDateColumn({ name: "createdAt", nullable: false })
  createdAt: Date;
}