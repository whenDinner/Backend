import { PostType } from "src/utils/interfaces";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import AccountEntity from "../account.entity";

@Entity({ name: "postsEntity" })
export default class PostsEntity {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;
  
  // 제목
  @Column({ name: 'title', type: 'varchar', nullable: false })
  title: string;

  // image = base64 + text
  @Column({ name: 'content', type: 'longtext', nullable: false })
  content: string;

  // 게시글을 어디에 썼느냐..
  @Column({ name: 'type', type: 'varchar', nullable: false })
  type: PostType;

  // 누가 씀? - uuid
  @ManyToOne(() => AccountEntity, user => user.uuid, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author', referencedColumnName: 'uuid' })
  author: string;

  @Column({ name: 'status', type: 'tinyint', nullable: false, default: 1 })
  status: number

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;
}
