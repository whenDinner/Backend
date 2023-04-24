import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'QRUnitEntity' })
export default class QRUnitEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;
}