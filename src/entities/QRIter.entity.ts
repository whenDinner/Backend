import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "QRIterEntity" })
export default class QRIterEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ name: "student_id", type: "varchar", length: 6, nullable: false })
  student_id: string;

  @Column({ name: "student_name", type: "varchar", length: 6, nullable: false })
  student_name: string;

  @Column({ name: "status", type: "bool", nullable: false })
  status: boolean;

  @Column({ name: "data", type: "text", nullable: false })
  data: string;

  @Column({ name: "type", type: "varchar", length: 16, nullable: false })
  type: string;

  @CreateDateColumn({ name: "createdAt", nullable: false })
  createdAt: Date;
  
  @UpdateDateColumn({ name: "updateAt", nullable: false })
  updateAt: Date;
}