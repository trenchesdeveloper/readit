import { Exclude, Expose } from "class-transformer";
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { makeid, slugify } from "../utils/helper";
import { Comment } from "./Comment";
import Base from "./Entity";
import { Sub } from "./Sub";
import { User } from "./User";
import { Vote } from "./Vote";

@Entity("posts")
export class Post extends Base {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index()
  @Column()
  identifier: string; // 7 character ID

  @Column()
  title: string;

  @Index()
  @Column()
  slug: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subName: string;

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subName", referencedColumnName: "name" })
  sub: Sub;

  @Exclude()
  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @Exclude()
  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0);
  }

  protected url: string;

  protected userVote: number;

  setUserVote(user: User) {
    const index = this.votes?.findIndex((v) => v.username === user.username);

    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  @AfterLoad()
  createFields() {
    this.url = `/r/${this.subName}/${this.identifier}/${this.slug}`;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeid(7);
    this.slug = slugify(this.title);
  }
}
