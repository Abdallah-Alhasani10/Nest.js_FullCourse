import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Search, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
// import { Post as PostInterface } from './interface/post.interface';
import { updatedto } from './dto/updatepostdto';
import { createPostdto } from './dto/create_post_dto';
import { Post as postentity} from './entities/Post_entities';
import { JwtAuthGuard } from 'src/auth/Guards/auth_guard';
import { currentuser } from 'src/auth/Decorator/currentuser_decorators';
import { FindPostQueryDTO } from './dto/findPostQueryDto';
import { PaginatedResponse } from 'src/common/interface/paginated-response.interface';


@Controller('post')
export class PostController {

    constructor(private readonly postservice:PostService){}

    @Get()
    async getallpost(@Query()query:FindPostQueryDTO):Promise<PaginatedResponse<postentity>>{
        return await this.postservice.getAllPost(query)

    }

    @Get(':id')
    async getonePost(@Param('id',ParseIntPipe)id:number):Promise<postentity>{
        return await this.postservice.getOnePost(id)
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body()createpostdata:createPostdto,@currentuser()user:any):Promise<postentity>{
        return await this.postservice.create(createpostdata,user)
    }
    @UseGuards(JwtAuthGuard)    
    @Put(':id')
    @HttpCode(HttpStatus.ACCEPTED)
    async edit(@Param('id',ParseIntPipe)id:number,
        @Body()updatedData:updatedto,@currentuser()user:any):Promise<postentity>{
            return await this.postservice.update(id,updatedData,user)
        }
    

    @Delete(':id')
    async delete(@Param('id',ParseIntPipe)id:number):Promise<void>{
        await this.postservice.delete(id)
    }
}
