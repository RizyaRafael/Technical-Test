import { Body, Controller, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/uploadData')
  @UseInterceptors(FileInterceptor('raw_data'))
  uploadFile(@UploadedFile() raw_data: Express.Multer.File) {
    return this.appService.postData(raw_data);
  }

  @Get('/getDatas')
  async getDatas(
    @Query('enodebId') enodebId: string,
    @Query('cellId') cellId: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date
  ) {
    // Convert the string query params to Date objects
    let start:any
    if (startDate) {
      start = new Date(startDate);
    }
    let end:any
    if (endDate) {
      end = new Date(endDate);
    }

    // Call the service method to get the filtered data
    return await this.appService.getDatas(enodebId, cellId, start, end);
  }
}
