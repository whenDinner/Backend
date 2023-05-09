import { CommentType } from "src/utils/interfaces";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
  @ManyToOne(type => AccountEntity, user => user.uuid)
  @JoinColumn({ name: 'user_uuid' })
  user_uuid: string;

  // 누가 씀? - id
  @ManyToOne(type => AccountEntity, user => user.login)
  @JoinColumn({ name: 'user_id' })
  user_id: string;

  @ManyToOne(type => CommentsEntity, comment => comment.id, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: CommentsEntity;

  @OneToMany(type => CommentsEntity, comment => comment.parent, { nullable: true })
  children: CommentsEntity[];
}