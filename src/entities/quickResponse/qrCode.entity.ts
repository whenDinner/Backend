import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'qrCodeEntity' })
export default class QRCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'name', type: 'varchar', length: 30, nullable: false, unique: true })
  name: string;

  @Column({ name: 'action', type: 'varchar', nullable: false })
  action: "OUTGO" | "PLACE" | "WRITE";

  @CreateDateColumn({ name: 'createAt' })
  createAt: Date;
}