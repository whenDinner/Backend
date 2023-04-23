import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'QRUnitEntity' })
export default class QREntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;
}