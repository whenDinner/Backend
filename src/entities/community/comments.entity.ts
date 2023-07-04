import { CommentType } from "src/utils/interfaces";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import AccountEntity from "../account.entity";

@Entity({ name: 'commentsEntity' })
export default class CommentsEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  // 게시글 id
  @Column({ name: 'target', type: 'int', nullable: false })
  target: number;

  // 일반 댓글임? 대댓글임?
  @Column({ name: 'type', type: 'varchar', nullable: false })
  type: CommentType;

  // 댓글 내용
  @Column({ name: 'comment', type: 'varchar', length: 255, nullable: false })
  comment: string;

  // 누가 씀? - uuid
  @ManyToOne(() => AccountEntity, user => user.uuid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author', referencedColumnName: 'uuid' })
  author: string;

  @ManyToOne(() => CommentsEntity, comment => comment.id, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent_id: CommentsEntity;

  @OneToMany(() => CommentsEntity, comment => comment.parent_id, { nullable: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  childrens: CommentsEntity[];
  
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}