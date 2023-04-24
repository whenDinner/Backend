import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'QRUnitEntity' })
export default class QRUnitEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ name: "data", type: "text", nullable: false })
  data: string;

  @Column({ name: "type", type: "varchar", length: 16, nullable: false })
  type: string;
}