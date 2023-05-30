import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "calendarEntity" })
export default class CalendarEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ name: 'type', type: 'varchar', length: 2, nullable: false })
  type: "잔류" | "귀가";

  @Column({ name: 'date', type: "timestamp", unique: true, nullable: false })
  date: Date;
}