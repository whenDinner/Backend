import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'outgoEntity' })
export default class OutgoEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  
}