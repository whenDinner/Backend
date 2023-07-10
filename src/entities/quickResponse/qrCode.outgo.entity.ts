import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import AccountEntity from "../account.entity";
import QRCodeEntity from "./qrCode.entity";

@Entity({ name: 'qrCodeOutgoEntity' })
export default class QrCodeOutgoEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @ManyToOne(() => QRCodeEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'qr_uuid', referencedColumnName: 'uuid' })
  qr_uuid: string;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author', referencedColumnName: 'uuid' })
  author: string;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'login' })
  user_id: string | AccountEntity;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}