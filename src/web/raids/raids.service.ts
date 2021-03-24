import { Injectable } from '@nestjs/common'
import { getRepository } from 'typeorm'
import { Raid } from '../../entities/Raid'

@Injectable()
export class RaidsService {
  private readonly raidsRepository = getRepository(Raid)
  
  async getRaids () {
    return this.raidsRepository.find({
      take: 10,
      order: { createdAt: 'DESC' },
      relations: ['from', 'to'],
    })
  }
}
