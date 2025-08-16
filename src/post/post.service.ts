import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { Post } from './interface/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/Post_entities';
import { Repository } from 'typeorm';
import { createPostdto } from './dto/create_post_dto';
import { updatedto } from './dto/updatepostdto';
import { USERROLE } from 'src/auth/entities/User_auth_dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FindPostQueryDTO } from './dto/findPostQueryDto';
import { PaginatedResponse } from 'src/common/interface/paginated-response.interface';
import { Cache } from 'cache-manager';
import { currentuser } from 'src/auth/Decorator/currentuser_decorators';
@Injectable()
export class PostService {

    private postListCacheKey:Set<string>=new Set();

    constructor(@InjectRepository(Post) private postRepository:Repository<Post>,
                    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
                ){}


    private generatePostlistCachekey(query: FindPostQueryDTO): string {
    const { page = 1, limit = 10, title } = query;
    return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
    }


    async getAllPost(query:FindPostQueryDTO):Promise<PaginatedResponse<Post>>{
        const cacheKey=this.generatePostlistCachekey(query);
        this.postListCacheKey.add(cacheKey);
        const getcacheData=await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey)
        
        if(getcacheData){
            console.log(`cache hit -------> returnig post list from cache ${cacheKey}`)
            return getcacheData
        }
        console.log(`Cache miss -----> Returnig posts list from database`)

        const {page=1,limit=10,title}=query;
        const skip=(page-1)*limit;
        const queryBuilder = this.postRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.authorname', 'authorname') // استخدم alias 'post' وليس 'Post'
            .orderBy('post.createdAt', 'DESC')                 // نفس الشيء هنا
            .skip(skip)
            .take(limit);


        if(title){
            queryBuilder.andWhere('post.title ILIKE:title',{title:`%${title}%`})
        }

        const [items, total] = await queryBuilder.getManyAndCount();
        const totalpage=Math.ceil(total/limit)
        const responseResult: PaginatedResponse<Post> = {
        items,
        meta: {
            currentpage: page,
            itemsperpage: limit,
            totalItems: total,
            totalPages:totalpage,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalpage,
        },
        };
        await this.cacheManager.set(cacheKey,responseResult,30000)
        return responseResult;

    }


    // async getAllPost():Promise<Post[]>{
    //     return await this.postRepository.find({
    //         relations:['authorname']
    //     })
    // }

    async getOnePost(id:number):Promise<Post>{
        const cachekey=`post${id}`;
        const cachedpost=await this.cacheManager.get<Post>(cachekey);
        if(cachedpost){
            console.log(`cached Hit --------> returing the data`)
            return cachedpost;
        }

        const postfounder= await this.postRepository.findOne({
            where:{id},
            relations:['authorname']
        })
        if (!postfounder){
            throw new NotFoundException(`post with ${id} not dound`)
        }
        console.log('Cache miss ------>Returnig form the DB')
        await this.cacheManager.set(cachekey,postfounder,30000)
        return postfounder
    }


    
    async create(createpostdata:createPostdto,currentuser:any):Promise<Post>{
        const newpost=await this.postRepository.create({
            title:createpostdata.title,
            content:createpostdata.content,
            authorname:currentuser
        })
        await this.invaildateAllExistingListCache()
        return this.postRepository.save(newpost)
    }


    async update(id:number,updateddatapost:updatedto,user:any):Promise<Post>{
    
        const olduser=await this.getOnePost(id)
        if(!olduser){
            throw new NotFoundException("post not found")
        }
        if((olduser.authorname.id!==user.id)&&(user.role!==USERROLE.ADMIN)){
            throw new ForbiddenException("you dont have permsion to updated that ")
        }
        if(updateddatapost.title){
            olduser.title=updateddatapost.title
        }
        if(updateddatapost.content){
            olduser.content=updateddatapost.title
        }
        const updatedpost=await this.postRepository.save(olduser)
        await this.cacheManager.del(`post${id}`)
        await this.invaildateAllExistingListCache();
        return updatedpost;
    }


    async delete(id:number):Promise<void>{
        const oldpost=await this.getOnePost(id)
        if(!oldpost){
            throw new NotFoundException("post not found")
        }

        await this.postRepository.delete(id)

        await this.cacheManager.del(`post${id}`)
        await this.invaildateAllExistingListCache();
    }


    private async invaildateAllExistingListCache():Promise<void>{
        console.log(`Invalidating ${this.postListCacheKey.size} list cache entries`)

        for (const key of this.postListCacheKey){
            await this.cacheManager.del(key)
        }
        this.postListCacheKey.clear()
    }
}
