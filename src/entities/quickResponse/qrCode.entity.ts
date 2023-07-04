import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import QrCodeUserEntity from "./qrCode.user.entity";

@Entity({ name: 'qrCodeEntity' })
export default class QRCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'name', type: 'varchar', length: 30, nullable: false, unique: true })
  name: string;

  @Column({ name: 'href', type: 'text', nullable: false })
  href: string;

  @ManyToMany(() => QrCodeUserEntity)
  childrens: string | QrCodeUserEntity;

  @CreateDateColumn({ name: 'createAt' })
  createAt: Date;
}