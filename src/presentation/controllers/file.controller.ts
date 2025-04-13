import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from 'src/domain/services/file/file.service';
import { FileDto } from '../dto/file.dto';
import { Response } from 'express';
import { FileQueryDto } from '../dto/file.query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { EntityToDtoMapper } from '../mapping/entity-to-dto.mapper';
import { AuthGuard } from '../guards/auth.guard';

@Controller('file')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly mapper: EntityToDtoMapper,
  ) {}

  @Get('list')
  @UseGuards(AuthGuard)
  async list(
    @Query() query: FileQueryDto,
  ): Promise<{ list_size: number; page: number; data: FileDto[] }> {
    const { listSize, page, data } = await this.fileService.list({
      listSize: query.list_size,
      page: query.page,
    });

    return {
      list_size: listSize,
      page,
      data: data.map((f) => this.mapper.mapFile(f)),
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async get(@Param('id') id: string): Promise<FileDto> {
    const file = await this.fileService.getById(id);
    return this.mapper.mapFile(file);
  }

  @Get('/download/:id')
  @UseGuards(AuthGuard)
  async download(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { file, data } = await this.fileService.getWithDataById(id);

    const encodedName = encodeURIComponent(file.name);

    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`,
    );

    return new StreamableFile(data);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  async upload(
    @UploadedFile() { buffer, originalname, mimetype }: Express.Multer.File,
  ): Promise<FileDto> {
    const file = await this.fileService.save({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      file: { buffer, name: originalname, mimeType: mimetype },
    });

    return this.mapper.mapFile(file);
  }

  @Put('/update/:id')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  async update(
    @UploadedFile() { buffer, originalname, mimetype }: Express.Multer.File,
    @Param('id') id: string,
  ): Promise<FileDto> {
    const file = await this.fileService.update(id, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      file: { buffer, mimeType: mimetype, name: originalname },
    });

    return this.mapper.mapFile(file);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string): Promise<FileDto> {
    const file = await this.fileService.delete(id);

    return this.mapper.mapFile(file);
  }
}
