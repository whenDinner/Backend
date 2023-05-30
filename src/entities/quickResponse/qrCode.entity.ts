import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import AccountEntity from "../account.entity";

type QRType = "BUS" | "DRM"

@Entity({ name: 'QREntity' })
export default class QRCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'name', type: 'varchar', length: 30, nullable: false, unique: true })
  name: string;

  @Column({ name: 'type', type: 'varchar', length: 6, nullable: false })
  type: QRType

  @Column({ name: 'href', type: 'text', nullable: false })
  href: string;

  @ManyToMany(() => AccountEntity, { onDelete: 'CASCADE' })
  user_uuid: string | AccountEntity;
}