import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import AccountEntity from "./account.entity";

@Entity({ name: 'outgoEntity' })
export default class OutgoEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author', referencedColumnName: 'uuid' })
  author: string | AccountEntity;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'login' })
  user_id: string | AccountEntity;

  @Column({ name: 'fri_out', type: 'boolean', nullable: false, default: false })
  fri_out: boolean;

  @Column({ name: 'sat_pm', type: 'boolean', nullable: false, default: false })
  sat_pm: boolean;

  @Column({ name: 'sun_am', type: 'boolean', nullable: false, default: false })
  sun_am: boolean;
  
  @Column({ name: 'sun_pm', type: 'boolean', nullable: false, default: false })
  sun_pm: boolean;

  @Column({ name: 'sun', type: 'boolean', nullable: false, default: false })
  sun: boolean;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'outgoDate', type: 'date', nullable: false })
  outgoDate: Date;

  @CreateDateColumn({ name: "createdAt", nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date | null | undefined;
}