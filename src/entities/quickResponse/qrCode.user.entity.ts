import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import AccountEntity from "../account.entity";
import QRCodeEntity from "./qrCode.entity";

@Entity({ name: 'qrCodeUserEntity' })
export default class QrCodeUserEntity {
  @PrimaryGeneratedColumn('identity', { name: 'id' })
  id: number;

  @ManyToOne(() => QRCodeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'qr_uuid', referencedColumnName: 'uuid' })
  qr_uuid: string;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid', referencedColumnName: 'uuid' })
  user_uuid: string;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'login' })
  user_id: string | AccountEntity;

  @ManyToOne(() => QRCodeEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'type', referencedColumnName: 'type' })
  type: string;
}