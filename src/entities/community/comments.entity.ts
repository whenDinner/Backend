import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

type CommentType = 'N' | 'R'

@Entity({ name: 'commentsEntity' })
export default class CommentsEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  // 일반 댓글이면 게시글 id, 대댓글이면 댓글 id
  @Column({ name: 'target', type: 'int', nullable: false })
  target: number;

  // 일반 댓글임? 대댓글임?
  @Column({ name: 'type', type: 'varchar', nullable: false })
  type: CommentType;

  // 댓글 내용
  @Column({ name: 'comment', type: 'varchar', length: 255, nullable: false })
  comment: string;

  // 누가 씀? - uuid
  @Column({ name: 'user_uuid', type: 'varchar', length: 36, nullable: false })
  user_uuid: string;

  // 누가 씀? - id
  @Column({ name: 'user_id', type: 'varchar', length: 36, nullable: false })
  user_id: string;
}