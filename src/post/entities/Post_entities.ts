import { User } from "src/auth/entities/User_auth_dto";
import { text } from "stream/consumers";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({length:50})
    title:string;
    @Column({type:'text'})
    content:string;
    @ManyToOne(()=>User,(user)=>user.posts)
    authorname:User;
    @CreateDateColumn()
    createdAt:Date;
    @UpdateDateColumn()
    updatedAt:Date;

}