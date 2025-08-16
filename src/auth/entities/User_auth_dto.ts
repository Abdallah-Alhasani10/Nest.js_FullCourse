import { Post } from "src/post/entities/Post_entities";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum USERROLE{
    USER='user',
    ADMIN="admin"
}


@Entity()
export class User{
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique:true})
    email:string;

    @Column()
    password:string;
    @Column()
    name:string;

    @Column({type:'enum',enum:USERROLE,default:USERROLE.USER})
    role:string;

    @OneToMany(()=>Post,(post)=>post.authorname)
    posts:Post[]

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date

}