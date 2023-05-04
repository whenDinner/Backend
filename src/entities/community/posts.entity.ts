import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
  @Column({ name: 'type', type: 'tinyint', nullable: false })
  type: number;

  // 누가 씀? - uuid
  @Column({ name: 'user_uuid', type: 'varchar', length: 36, nullable: false })
  user_uuid: string;

  // 누가 씀? - id
  @Column({ name: 'user_id', type: 'varchar', length: 36, nullable: false })
  user_id: string;
}